"use strict";

/**
 * describeTable
 *
 * @param client
 * @param {String} tableName
 * @returns {Promise}
 */
module.exports = function describeTable(client, tableName) {

  return new Promise(function (resolve, reject) {

    var params = {
      TableName: tableName
    };

    client.endpoint.describeTable(params, function (err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve(res.Table);
    });
  });
};