"use strict";

var transform = require("./transform");
var promise = require("./promise");
var UploadStream = require("./stream/upload");
var DownloadStream = require("./stream/download");

var inspect = require("util").inspect;

function i(obj) {
  console.log(inspect(obj, {depth: null, colors: true}));
}

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
        client.tables[definition] = definitions[definition];
      }
    }
    ,
    create: function (tableName) {

      if (typeof tableName === "string") {
        tableName = client.tables[tableName];
      }
      return promise.createTable(client, tableName)
    }
    ,
    read: function (tableName) {

      if (typeof tableName === "object") {
        tableName = tableName.TableName;
      }
      return promise.describeTable(client, tableName)
    }
    ,
    delete: function (tableName) {

      if (typeof tableName === "object") {
        tableName = tableName.TableName;
      }
      return promise.deleteTable(client, tableName)
    }
    ,
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
    }
    ,
    active: function (tableName) {

      var db = this;

      return new Promise(function (resolve, reject) {

        var tries = 0;

        function retry() {
          tries++;

          db.read(tableName).then(function (data) {
            if (tries > 10) {
              reject(Error("Exceeded number of attempts"));
            }
            if (data.TableStatus === "ACTIVE") {
              resolve(data);
            }
            if (data.TableStatus !== "ACTIVE") {
              setTimeout(retry, 5000);
            }
          })
            .catch(function (err) {
              reject(err);
            });
        }

        retry();
      });
    }
    ,
    recreate: function (tableName) {
      var db = this;

      return db.active(tableName)
        .then(function () {
          return db.delete(tableName);
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
        multiRead: function (client, tableName, keys) {
          var params = {
            RequestItems: {}
          };

          params.RequestItems[tableName] = {Keys: keys};

          return promise.batchGetItem(client, params);
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
         * @param {Object} item
         * @returns {Promise}
         */
        upsert: function (item) {

          var params = {
            Item: item
          };

          return promise.putItem(client, tableName, params);
        },
        multiUpsert: function (client, items) {
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
         * Upload <input> using UploadStream
         *
         * Pass an array or a readableStream as <input>
         * to get a Promise which handles the events internally
         *
         * `.upload([]).then(...)`
         * `upload(downloadStream).then(...)`
         *
         * or
         *
         * Call without an argument to get the WritableStream instance
         * for custom piping
         *
         * `downloadStream.pipe(client.table("test").upload())`
         *
         * @param {Array|ReadableStream} input
         * @returns {Promise|WritableStream}
         */
        upload: function (input) {

          var uploadStream = new UploadStream(client, table(tableName).multiUpsert);

          function write() {
            var ok = true,
              currentItem;

            while (ok && (currentItem = input.shift()) !== undefined) {

              if (input.length === 0) {
                uploadStream.end(currentItem);
                break;
              }

              ok = uploadStream.write(currentItem, function () {
              });

              if (!ok) {
                uploadStream.once("drain", write);
                break;
              }
            }
          }

          //manual stream mode
          if (!input) {
            return uploadStream;
          }

          var promise = new Promise(function (resolve, reject) {

            uploadStream.on("finish", function (res) {
              resolve();
            });

            uploadStream.on("error", reject);
          });

          //array to stream
          if (Array.isArray(input)) {
            write();
          }
          else {
            //wrapped stream handling
            input.pipe(uploadStream);
          }

          return promise;
        },
        /**
         * Down
         * @param writableStream
         * @returns {*}
         */
        download: function (writableStream) {

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
        /**
         * deletes an item
         * @param hash
         * @param range
         * @returns {Promise}
         */
        delete: function (hash, range) {

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

            if(++conditionCnt === 2) {
              i(params);
              return promise.query(client, params);
            }

            return getConditionSugar(exec);
          }

          return getConditionSugar(exec);
        },
        findAll: function(params) {

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
          return promise.query(client, params);
        },
        scan: function (params) {

          params = params || {};

          params.TableName = params.TableName || tableName;

          var scanSugar = {
            exec: function () {
              return promise.scan(client, params);
            }
          };

          return scanSugar;
        },
        scanAll: function (params) {

          params = params || {};
          params.TableName = params.TableName || tableName;

          var items = [];

          function doScan() {

            return promise.scan(client, params)
              .then(function (res) {

                items = items.concat(res.Items);

                if (res.LastEvaluatedKey) {
                  params.ExclusiveStartKey = res.LastEvaluatedKey;
                  return doScan();
                }

                return items;
              });
          }

          return doScan();

        },
        multiPatch: function multiPatchItems() {

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