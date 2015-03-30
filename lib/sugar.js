var transform = require("./transform");

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
      create: function (tableName) {

        console.log("CREATING", tableName);
        
        if (typeof tableDefinition === "string") {
            tableDefinition = client.tables[tableDefinition];
        }
       
        return new Promise(function (resolve, reject) {

          client.endpoint.createTable(tableDefinition, function (err, res) {
            if ( err) {
              reject(err);
            }
            if (!err) {
              resolve(res);
            }
          });
        });
      }
      ,
      read: function( tableName ) {
        
        console.log("READING", tableName);
        
        return new Promise(function (resolve, reject) {

          var params = {
            TableName: tableName
          };
          

          client.endpoint.describeTable(params, function (err, res) {
            if ( err) {
              reject(err);
            }
            if (!err) {
              resolve(res.Table);
            }
          });
        });
      } 
      ,
      delete: function (tableName) {
      
        console.log("DELETING", tableName);
        
        return new Promise(function (resolve, reject) {

          var params = {
            TableName: tableName
          };

          client.endpoint.deleteTable(params, function (err, res) {
            if ( err) {
              reject(err);
            }
            if (!err) {
              resolve(res.Table);
            }
          });
        });
      }
      ,
      status: function (tableName) {

        var read = this.read(tableName);

        return new Promise(function (resolve, reject) {

          return read.then(function(data) {

            resolve({
                TableSizeBytes: data.TableSizeBytes,
                TableStatus: data.TableStatus,
                ItemCount: data.ItemCount,
                //TODO maybe find a better name than "outdated"
                //TODO not working with simple diff: https://github.com/epha/model/issues/2
                //outdated: JSON.stringify(tableDb) !== JSON.stringify(tables[tableName])
            });
            
          }, reject);
        });
      }
      ,
      exist: function(tableName) {
        
        return new Promise( function(resolve,reject) {
          
          var params = {
            TableName: tableName /* required */
          };

          client.endpoint.waitFor('tableExists', params, function(err, data) {
            if ( err) reject(err);
            if (!err) resolve(data);  
          });
        });
      }
      ,
      recreate: function(tableName) {
        
        var db = this;
          
        return db.read(tableName).then( function(data) {
          if( data.TableStatus == "ACTIVE" ) {
            return db.delete(tableName);
          }
        }).then( function(data) {
          return db.create(tableName);
        })
        .catch( function(err) {
          if (err.code == "ResourceNotFoundException" ) {
            return db.create(tableName);
          }
        })
        ;
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