"use strict";

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

//http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
var transform = require("../transform");

module.exports = function(client, tableName, params) { 

  return new Promise(function (resolve, reject) {
    
    params = params || {};
       
    params.TableName = tableName;
    params.Item = transform.to(params.Item);  

    client.endpoint.putItem(params, function (err, res) {
      if( err) {
        reject(err);
      }
      if(!err) {
        resolve(res);
      }
    });
    
  });
};