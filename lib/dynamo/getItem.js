"use strict";

/**
 * getItem
 *
 * @param client
 * @param {String} tableName
 * @param {Object=} params
 * @returns {Promise}
 */
module.exports = function getItem(client, tableName, params) {

  return new Promise(function (resolve, reject) {

    params = params || {};

    params.TableName = tableName;
    // TODO filter item to keys

    client.endpoint.getItem(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res.Item);
    });
  });
};