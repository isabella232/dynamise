"use strict";

var transform = require("./transform");
var promise = require("./promise");

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
            if (data.TableStatus == "ACTIVE") {
              resolve(data);
            }
            if (data.TableStatus != "ACTIVE") {
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

      return new Promise(function (resolve, reject) {

        return db.active(tableName).then(function (data) {
          return db.delete(tableName);
        })
          .then(function (data) {
            return db.active(tableName);
          })
          .then(function (data) {
            return db.create(tableName);
          })
          .catch(function (err) {
            if (err.code == "ResourceNotFoundException") {
              return db.create(tableName);
            }
            else {
              reject(err);
            }
          })
          .then(function (data) {
            return db.active(tableName);
          })
          .then(function (data) {
            resolve(data);
          })
          .catch(function (err) {
            reject(err);
          });
      });
    }
    ,
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
            names["#key2"] = keys[1].AttributeName
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
          return promise.query(client, tableName, params);
        },
        scan: function () {
          return promise.scan(client, tableName, params);
        },
        multiPatch: function multiPatchItems() {

        },
        multiUpsert: function multiUpsertItems() {

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