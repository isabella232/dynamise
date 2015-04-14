"use strict";

var transform = require("./transform");
var promise = require("./promise");
var UploadStream = require("./stream/upload");

var inspect = require("util").inspect;

function i() {
  console.log(inspect.call(this, arguments, {depth: null, color: true}));
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

          params.RequestItems[tableName] = { Keys: keys };

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
        query: function (params) {

          params = params || {};

          params.TableName = params.TableName || tableName;

          var selectMapping = {
            all: "ALL_ATTRIBUTES",
            projected: "ALL_PROJECTED_ATTRIBUTES",
            count: "COUNT"
          };

          //TODO filter expression

          //TODO projection expression

          //TODO expression attribute names

          //TODO see https://github.com/ryanfitz/vogels/blob/master/lib/query.js for inspiration

          var querySugar = {
            where: function (key) {
            },
            exec: function () {

              //TODO wrap response to be able to do sth like res.next(); with next start key and same params
              return promise.query(client, params);
            }
          };

          return querySugar;
        },
        scan: function (params) {

          params = params || {};

          params.TableName = params.TableName || tableName;

          var scanSugar = {
            exec: function() {
              return promise.scan(client, params);
            }
          };

          return scanSugar;
        },
        scanAll: function(params) {

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