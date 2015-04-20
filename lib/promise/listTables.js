"use strict";

/**
 * describeTable
 *
 * @param client
 * @param {String} tableName
 * @returns {Promise}
 */
module.exports = function listTables(client,params) {

  return new Promise(function (resolve, reject) {

    params = params || {};

    client.endpoint.listTable(params, function (err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};