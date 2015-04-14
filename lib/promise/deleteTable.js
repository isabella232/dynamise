"use strict";

/**
 * deleteTable
 *
 * @param client
 * @param {String} tableName
 * @returns {Promise}
 */
module.exports = function deleteTable(client, tableName) {

  return new Promise(function (resolve, reject) {

    var params = {
      TableName: tableName
    };

    client.endpoint.deleteTable(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};