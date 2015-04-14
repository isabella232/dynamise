"use strict";

/**
 * createTable
 *
 * @param client
 * @param {Object} tableDefinition
 * @returns {Promise}
 */
module.exports = function createTable(client, tableDefinition) {

  return new Promise(function (resolve, reject) {

    client.endpoint.createTable(tableDefinition, function (err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};