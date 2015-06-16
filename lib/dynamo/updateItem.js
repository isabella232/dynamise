"use strict";

/**
 * updateItems
 *
 * @param {Object} client
 * @param {String} tableName
 * @param {Object} params
 * @returns {Promise}
 */
module.exports = function updateItems(client, tableName, params) {

  return new Promise(function (resolve, reject) {

    params = params || {};
    params.TableName = tableName;
    params.ReturnValues = params.ReturnValues || "ALL_NEW";

    client.endpoint.updateItem(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};