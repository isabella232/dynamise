"use strict";

var transform = require("../transform");

/**
 * updateItems
 *
 * @param client
 * @param {String} tableName
 * @param {Object} item
 * @param {Object=} params
 * @returns {Promise}
 */
module.exports = function updateItems(client, tableName, item, params) {

  return new Promise(function (resolve, reject) {

    params = params || {};

    params.TableName = tableName;
    params.Item = transform.to(item);

    client.endpoint.updateItem(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};