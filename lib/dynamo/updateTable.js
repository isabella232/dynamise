"use strict";

/**
 * updateTable
 *
 * http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateTable.html
 *
 * @param {Object} client
 * @param {Object} params
 * @returns {Promise}
 */
module.exports = function updateTable(client, params) {

  return new Promise(function (resolve, reject) {
    client.endpoint.updateTable(params, function (err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};