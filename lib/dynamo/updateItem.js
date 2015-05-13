"use strict";

var inspect = require("util").inspect;

var transform = require("../transform");

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
    params.Key = transform.to(params.Key);
    params.ReturnValues = "ALL_NEW";

    for (var key in params.AttributeUpdates) {
      if (params.AttributeUpdates[key].Action === 'PUT') {
        params.AttributeUpdates[key].Value = transform.to({ dirty: params.AttributeUpdates[key].Value}).dirty;
      }
    }

    client.endpoint.updateItem(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};