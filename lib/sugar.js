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
        console.log("CREATE", tableName);
        return promise.createTable(client,tableName)
      }
      ,
      read: function(tableName) {
        console.log("READ", tableName);
        return promise.describeTable(client,tableName)
      }
      ,
      delete: function (tableName) {   
        console.log("DELETE", tableName);
        return promise.deleteTable(client,tableName)
      }
      ,
      active: function(tableName) {

        var db = this;
        
        return new Promise(function(resolve,reject) {
          
          return db.read(tableName).then( function(data) {
            if( data.TableStatus == "ACTIVE" ) {
              resolve(data);
            }
            if( data.TableStatus != "ACTIVE") {
              setTimeout(function() {
                return db.active(tableName);
              },5000);
            }
          })
          .catch(function(err) {
            reject(err);
          })
          
        });
      }
      ,
      status: function(tableName) {

        var db = this;

        return new Promise(function (resolve, reject) {

          return db.read.then(function(data) {

            resolve({
                TableSizeBytes: data.TableSizeBytes,
                TableStatus: data.TableStatus,
                ItemCount: data.ItemCount,
                //TODO maybe find a better name than "outdated"
                //TODO not working with simple diff: https://github.com/epha/model/issues/2
                upgradable: JSON.stringify(data) !== JSON.stringify(client.tables[tableName])
            });
            
          }, reject);
        });
      }
      ,
      recreate: function(tableName) {
        
        var db = this;
          
        return new Promise( function(resolve,reject) {
          
          return db.active(tableName).then(function(data){
            return db.delete(tableName);      
          }).then(function(data) {
            console.log("WAIT FOR ACTIVE AFTER DELETNG", tableName );
            return db.active(tableName);
          }).catch(function(err) {       
            if(err.code == "ResourceNotFoundException" ) {
              console.log("NOT FOUND ERROR THEREFORE CREATE");
              return db.create(tableName);
            }
            else{
              reject(err);
            }   
          }).then(function(data) {
            console.log("WAIT FOR ACTIVE AFTER CREATING", tableName );
            return db.active(tableName);
          }).then(function(data) {
            console.log("RECREATED", tableName );
            resolve(data);
          });
;
      });
    }
    ,
    upgrade: function upgradeTable(tableName) {

            //TODO reuse same function as above calling this.read (needs a class)
            return new Promise(function (resolve, reject) {

                var params = {
                    TableName: tableName
                };

                client.describeTable(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res.Table);
                });
            })

                .then(function () {
                    //TODO calculate diff and build updateTable params
                    throw new Error("Not implemented yet.");
                });


        },
        table: function table(tableName) {
          return {
          /**
           * Creates a new item
           *
           * Rejects if an item already exists in the
           * specified table with the same primary key
           *
           * var params = {
           *    TableName:"",
           *    Item:{},
           *
           *    Expected: {
           *      Exists: (true|false),
           *      Value: { type: value },
           *    },
           *    ReturnConsumedCapacity: ('INDEXES | TOTAL | NONE'),
           *    ReturnItemCollectionMetrics: ('SIZE | NONE')
           *    ReturnValues: ('NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW')
           *  }
           *
           * returns data = {
           *     Attributes:{}
           *   }
           *
           * @param item
           * @returns {Promise}
           */
          create: function createItem(item) {

              //TODO To prevent a new item from replacing an existing item, use a conditional
              //put operation with ComparisonOperator set to NULL for the primary key attribute, or attributes.
              //http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html

              return new Promise(function (resolve, reject) {
                  var params = {
                      TableName: tableName,
                      Item: transform.to(item)
                  };

                  client.putItem(params, function (err, res) {
                      if (err) {
                          reject(err);
                          return;
                      }

                      resolve(res);
                  });
              });
          },
          read: function readItem(key) {

              return new Promise(function (resolve, reject) {
                  var params = {
                      TableName: tableName,
                      Key: transform.to(key)
                  };

                  client.getItem(params, function (err, res) {
                      if (err) {
                          reject(err);
                          return;
                      }

                      if (res.Item) {
                          res.Item = transform.from(res.Item);
                      }

                      resolve(res.Item);
                  });
              });
          },
          query: function queryItem() {

          },
          scan: function scanItem() {

          },
          /**
           * patches only existing Items
           * @returns {Promise}
           */
          patch: function patchItem(item) {

              //TODO tweak params to not create but only patch!

              return new Promise(function (resolve, reject) {
                  var params = {
                      TableName: tableName,
                      Item: transform.to(item)
                  };

                  client.updateItem(params, function (err, res) {
                      if (err) {
                          reject(err);
                          return;
                      }

                      resolve(res);
                  });
              });
          },
          /**
           * Replaces or creates an Item
           * @param {Object} item
           * @returns {Promise}
           */
          upsert: function upsertItem(item) {

              return new Promise(function (resolve, reject) {
                  var params = {
                      TableName: tableName,
                      Item: transform.to(item)
                  };

                  client.putItem(params, function (err, res) {
                      if (err) {
                          reject(err);
                          return;
                      }

                      resolve(res);
                  });
              });
          },
          /**
           * deletes an Item
           * @param {Object} key
           * @returns {Promise}
           */
          delete: function deleteItem(key) {

              //TODO if passed an object, extract keys using attribute schema

              return new Promise(function (resolve, reject) {

                  var params = {
                      TableName: tableName,
                      Key: transform.to(key)
                  };

                  client.deleteItem(params, function (err, res) {
                      if (err) {
                          reject(err);
                          return;
                      }

                      resolve(res);
                  });
              });
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