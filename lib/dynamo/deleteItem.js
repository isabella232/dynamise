"use strict";

/**
 * deleteItem
 *
 * @param client
 * @param {String} tableName
 * @param {Object=} params
 * @returns {Promise}
 */
module.exports = function deleteItem(client, tableName, params) {

  return new Promise(function (resolve, reject) {

    params = params || {};

    params.TableName = tableName;

    client.endpoint.deleteItem(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};