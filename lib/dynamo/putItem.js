"use strict";


/**
 * putItem
 *
 * "Creates a new item, or replaces an old item with a new item
 * (including all the attributes). If an item already exists in
 * the specified table with the same primary key, the new item
 * completely replaces the existing item."
 *
 * http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
 *
 * @param client
 * @param {String} tableName
 * @param {Object=} params
 * @returns {Promise}
 */
module.exports = function putItem(client, tableName, params) {

  return new Promise(function (resolve, reject) {

    params = params || {};

    params.TableName = tableName;

    client.endpoint.putItem(params, function (err, res) {
      
      if ( err) {
        reject(err);
      }
      if (!err) {
        resolve(res);
      }

    });
  });
};