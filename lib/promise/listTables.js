"use strict";

/**
 * listTables
 *
 * Returns an array of table names associated with the current account and endpoint.
 *
 * @param client
 * @param params
 * @returns {Promise}
 */
module.exports = function listTables(client, params) {

  return new Promise(function (resolve, reject) {

    params = params || {};

    client.endpoint.listTables(params, function (err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};