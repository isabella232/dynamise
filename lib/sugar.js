var transform = require("./transform");
var promise = require("./promise");

function sugar(client) {

    return {
      //---
      // Table Definitions
      set: function( definitions ) {
        for( var definition in definitions ) {
          client.tables[definition] = definitions[definition];
        }
      }
      ,
      create: function(tableName) {
        return promise.createTable(client,tableName)
      }
      ,
      read: function(tableName) {
        return promise.describeTable(client,tableName)
      }
      ,
      delete: function (tableName) {   
        return promise.deleteTable(client,tableName)
      }
      ,
      status: function(tableName) {

        var db = this;

        return new Promise(function (resolve, reject) {

          var compare = [
            "ProvisionedThroughput",
            "ReadCapacityUnits",
            "WriteCapacityUnits"
          ];

          db.read(tableName).then(function(data) {
          
            resolve({
                TableSizeBytes: data.TableSizeBytes,
                TableStatus: data.TableStatus,
                ItemCount: data.ItemCount,
                Upgradable: JSON.stringify(data,compare) != JSON.stringify(client.tables[tableName],compare)
            });
            
          })
          .catch(reject);
        });
      }
      ,
      active: function(tableName) {
        
        var db = this;
        
        return new Promise( function(resolve,reject) {
          
          var tries = 0;
          
          function retry() {
            tries++;
            
            db.read(tableName).then(function(data) {
              if( tries > 10 ) {
                reject(Error("Exceeded number of attempts"));
              }
              if( data.TableStatus == "ACTIVE" ) {
                resolve(data);
              }
              if( data.TableStatus != "ACTIVE" ) {
                setTimeout(retry,5000);
              }
            })
            .catch(function(err) {
              reject(err);
            });
          }
          retry();
        });
      }
      ,
      recreate: function(tableName) {
        
        var db = this;
          
        return new Promise( function(resolve,reject) {
          
          return db.active(tableName).then(function(data){
            return db.delete(tableName);      
          })
          .then(function(data) {
            return db.active(tableName);
          })
          .then(function(data){
            return db.create(tableName);
          })
          .catch(function(err) {    
            if(err.code == "ResourceNotFoundException" ) {
              return db.create(tableName);
            }
            else{
              reject(err);
            }   
          })
          .then(function(data) {
            return db.active(tableName);
          })
          .then(function(data) {
            resolve(data);
          })
          .catch(function(err) {
            reject(err);
          });
      });
    }
    ,
    table: function table(tableName) {
      return {
        create: function(item) {
          
          var params = {
              "Item": item
          };
          /*
          }*/        
            params.ConditionExpression = "#h <> :h OR #r <> :r";
            params.ExpressionAttributeNames = {
              "#h":"UserId",
              "#r":"FileId"
            };
            params.ExpressionAttributeValues = {
              ":h": {"S": "1"},
              ":r": {"S": "5"}
            };
          return promise.putItem(client,tableName,params);
        }, 
        read: function(key) {
          return promise.getItem(client,tableName,key);
        },
        /**
         * patches only existing Items
         * @returns {Promise}
         */
        patch: function(item) {
          return promise.updateItem(client,tableName,item);
        },
        /**
         * Replaces or creates an Item
         * @param {Object} item
         * @returns {Promise}
         */
        upsert: function(item) {
          return promise.putItem(client,tableName,item);
        },
        /**
         * deletes an Item
         * @param {Object} key
         * @returns {Promise}
         */
        delete: function(key) {
          return promise.deleteItem(client,tableName,key);
        },
        query: function(params) {
          return promise.query(client,tableName,params);
        },
        scan: function() {
          return promise.scan(client,tableName,key);
        },
        multiPatch: function multiPatchItems() {

        },
        multiUpsert: function multiUpsertItems() {

        }
      }
    }
  }
}

module.exports = sugar;