"use strict";

var stream = require("stream");

var _ = require('lodash');

var transform = require("./transform");
var promise = require("./promise");
var UploadStream = require("./stream/upload");
var DownloadStream = require("./stream/download");

// helper tools
var i = require("./utils").i;
var throttledParallel = require("./utils").throttledParallel;
var delay = require("./utils").delay;

function getConditionSugar(exec) {
  return {
    where: function (key) {
      //TODO check of key in tableDescription
      return {
        beginsWith: function (value) {
          return exec(key, value, "BEGINS_WITH");
        },
        equals: function (value) {
          return exec(key, value, "EQ");
        },
        lt: function (value) {
          return exec(key, value, "LT");
        },
        le: function (value) {
          return exec(key, value, "LE");
        },
        between: function (value) {
          return exec(key, value, "BETWEEN");
        },
        gt: function (value) {
          return exec(key, value, "GT");
        },
        ge: function (value) {
          return exec(key, value, "GE");
        }
      };
    }
  };
}

function addCondition(params, key, value, operator) {
  //TODO find out why primitives are not working with transform.to / maybe check transform keys of same module
  value = {
    "key": value
  };

  value = transform.to(value).key;
  params.KeyConditions[key] = {
    AttributeValueList: [value],
    ComparisonOperator: operator
  };

  return params;
}

function sugar(client) {

  return {
    //---
    // Specific Table Definitions
    // @definitions (object) { tableName:tableSchema }
    set: function (definitions) {
      for (var definition in definitions) {
        if (definitions.hasOwnProperty(definition)) {
          client.tables[definition] = definitions[definition];
        }
      }
    },
    get: function (definition) {
      if (definition) {
        return client.tables[definition];
      }
      if (!definition) {
        return client.tables;
      }
    },
    listTables: function (params) {
      return promise.listTables(client, params);
    },
    create: function (tableName) {

      if (typeof tableName === "string") {
        tableName = client.tables[tableName];
      }
      return promise.createTable(client, tableName)
    },
    read: function (tableName) {

      if (typeof tableName === "object") {
        tableName = tableName.TableName;
      }
      return promise.describeTable(client, tableName)
    },
    remove: function (tableName) {

      if (typeof tableName === "object") {
        tableName = tableName.TableName;
      }
      return promise.deleteTable(client, tableName)
    },
    status: function (tableName) {

      var db = this;

      if (typeof tableName === "object") {
        tableName = tableName.TableName;
      }

      return new Promise(function (resolve, reject) {

        var compare = [
          "ProvisionedThroughput",
          "ReadCapacityUnits",
          "WriteCapacityUnits"
        ];

        db.read(tableName).then(function (data) {

          resolve({
            TableSizeBytes: data.TableSizeBytes,
            TableStatus: data.TableStatus,
            ItemCount: data.ItemCount,
            Upgradable: JSON.stringify(data, compare) != JSON.stringify(client.tables[tableName], compare)
          });

        })
          .catch(reject);
      });
    },
    active: function (tableName) {

      var db = this,
        tries = 0;

      return new Promise(function (resolve, reject) {

        function retry() {
          tries++;

          db.read(tableName).then(function (data) {

            if (tries > 20) {
              reject(Error("Exceeded number of attempts"));
            }
            if (data.TableStatus === "ACTIVE") {
              resolve(data);
            }
            if (data.TableStatus !== "ACTIVE") {
              setTimeout(retry, 1000);
            }
          })
            .catch(function (err) {
              reject(err);
            });
        }

        retry();
      });
    },
    recreate: function (tableName) {
      var db = this;

      return db.active(tableName)
        .then(function () {
          return db.remove(tableName);
        })
        .then(function () {
          return db.active(tableName);
        })
        .then(function () {
          return db.create(tableName);
        })
        .catch(function (err) {
          if (err.code === "ResourceNotFoundException") {
            return db.create(tableName);
          }
          throw err;
        })
        .then(function () {
          return db.active(tableName);
        });
    },
    multiWrite: function (params) {

      function again() {
        return promise.batchWriteItem(client, params).then(function (res) {
          if (Object.keys(res.UnprocessedItems).length > 0) {
            params.UnprocessedItems = res.UnprocessedItems;
            return again();
          }
          return res;
        });
      }

      return again();
    },
    multiRead: function (params) {
      var tables = {};

      function again() {
        return promise.batchGetItem(client, params).then(function (res) {
          Object.keys(res.Responses).forEach(function (table) {
            tables[table] = tables[table] || [];
            tables[table] = tables[table].concat(res.Responses[table]);
          });
          if (Object.keys(res.UnprocessedKeys).length > 0) {
            params.UnprocessedKeys = res.UnprocessedKeys;
            return again();
          }
          return tables;
        });
      }

      return again();
    },

    table: function table(tableName) {
      return {
        create: function (item) {

          var condition = "";
          var names = {};
          var values = {};
          var keys = client.tables[tableName].KeySchema;

          // HASH
          if (keys.length > 0) {
            condition = "#key1 <> :key1";
            names["#key1"] = keys[0].AttributeName;
            values[":key1"] = transform.to(item)[keys[0].AttributeName];
          }
          // RANGE
          if (keys.length > 1) {
            condition += " OR #key2 <> :key2";
            names["#key2"] = keys[1].AttributeName;
            values[":key2"] = transform.to(item)[keys[1].AttributeName];
          }

          var params = {
            Item: item,
            ConditionExpression: condition,
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values
          };

          return promise.putItem(client, tableName, params);
        },
        /**
         * Get Item for hash, hash & range or item
         * @returns {Promise}
         */
        read: function (hash, range) {

          var params = {
            Key: this.util.getKey(hash, range)
          };

          return promise.getItem(client, tableName, params);
        },
        /**
         * patches only existing Items
         * @returns {Promise}
         */
        patch: function (item) {

          var params = {
            Item: item
          };

          return promise.updateItem(client, tableName, params);
        },
        /**
         * Replaces or creates an Item
         *
         * @param {Object} item
         * @returns {Promise}
         */
        upsert: function (item) {
          var params = {
            Item: item
          };

          return promise.putItem(client, tableName, params);
        },
        /**
         * multiUpsert
         *
         * IMPORTANT NOTICE:
         * We can only process 25 items at a time. You have to handle
         * that in your function that uses multiUpsert! This restriction
         * is due to the limit of batchWriteItem.
         *
         * See:
         * http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
         *
         *
         * @param items
         * @returns {*}
         */
        multiUpsert: function (items) {
          var params = {
            RequestItems: {}
          };

          params.RequestItems[tableName] = [];

          items.forEach(function (item) {
            params.RequestItems[tableName].push({
              PutRequest: {
                Item: item
              }
            });
          });

          return promise.batchWriteItem(client, params);
        },
        /**
         * Upload <input>
         *
         * Pass an array as <input> to get a Promise which handles the events internally
         * `.upload([]).then(...)`
         *
         * @param {Array} input
         * @returns {Promise}
         */
        upload: function (input) {

          if (!Array.isArray(input)) {
            throw new Error('upload only accepts an array as argument')
          }

          var multiUpsert = this.multiUpsert;

          // separate into pieces of 25 items
          var tmp = _.chunk(input, 25);

          function doUpload(input) {
            return multiUpsert(input)
              .catch(function (err) {
                console.trace(err.stack);
                throw err;
              });
          }

          return throttledParallel(tmp, doUpload);
        },
        /**
         * createUploadStream
         *
         * @returns {UploadStream}
         */
        createUploadStream: function () {
          return new UploadStream(client, table(tableName).multiUpsert);
        },
        /**
         * Down
         * @param writableStream
         * @returns {*}
         */
        download: function (writableStream) {

          // TODO: do it via scanAll (stream is outsourced to createDownloadStream())
          var downloadStream = new DownloadStream(client, table(tableName).scanAll);

          if (!writableStream) {
            return downloadStream;
          }

          return new Promise(function (resolve, reject) {

            downloadStream.on("error", reject);
            writableStream.on("error", reject);
            writableStream.on("end", resolve);

            downloadStream.pipe(writableStream);
          });
        },
        createDownloadStream: function () {
          return new DownloadStream(client, table(tableName).scanAll);
        },
        /**
         * removes an item
         *
         * @param hash
         * @param range
         * @returns {Promise}
         */
        remove: function (hash, range) {

          var params = {
            Key: this.util.getKey(hash, range)
          };

          return promise.deleteItem(client, tableName, params);
        },
        find: function (params) {

          var conditionCnt = 0;

          params = params || {};
          params.TableName = params.TableName || tableName;
          params.KeyConditions = params.KeyConditions || {};

          function exec(key, value, operator) {
            if (key && value) {
              addCondition(params, key, value, operator);
            }

            if (++conditionCnt === 2) {
              i(params);
              return promise.query(client, params);
            }

            return getConditionSugar(exec);
          }

          return getConditionSugar(exec);
        },
        findAll: function (params) {

          params = params || {};
          params.TableName = params.TableName || tableName;
          params.KeyConditions = params.KeyConditions || {};

          function exec(key, value, operator) {
            if (key && value) {
              addCondition(params, key, value, operator);
            }

            i(params);
            return promise.query(client, params);
          }

          return getConditionSugar(exec);
        },
        query: function (params) {

          params = params || {};
          params.TableName = params.TableName || tableName;

          return promise.query(client, params);
        },
        scan: function (params) {

          params = params || {};
          params.TableName = params.TableName || tableName;

          return promise.scan(client, params);
        },
        scanAll: function (params) {

          var scan = table(tableName).scan;
          var items = [];

          function doScan() {
            return scan(params).then(function (res) {
              items = items.concat(res.Items);
              if (res.LastEvaluatedKey) {
                params.ExclusiveStartKey = res.LastEvaluatedKey;
                return doScan();
              }
              return items;
            }, function (err) {
              // TODO: find a better way to display error (now needed for download)
              console.error(err);
            });
          }

          return doScan();
        },
        util: {
          /**
           * getKey
           * @param hash
           * @param range
           * @returns {{}}
           */
          getKey: function (hash, range) {

            var keySchema = {};

            if (typeof hash === "object" && range === undefined) {
              keySchema = hash;
            }

            if (typeof hash !== "object") {
              var schema = client.tables[tableName].KeySchema;
              var defHash = schema.filter(function (key) {
                return key.KeyType === "HASH";
              });
              var defRange = schema.filter(function (key) {
                return key.KeyType === "RANGE";
              });

              if (defHash.length > 0 && hash !== undefined) {
                keySchema[defHash[0].AttributeName] = hash;
              }
              if (defRange.length > 0 && range !== undefined) {
                keySchema[defRange[0].AttributeName] = range;
              }
            }

            return keySchema;
          }
        }
      };
    }
  };
}

module.exports = sugar;