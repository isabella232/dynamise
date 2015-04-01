"use strict";

module.exports = function(client, tableName) {
  
  return new Promise(function (resolve, reject) {

    var params = {
      TableName: tableName
    };

    client.endpoint.deleteTable(params, function (err, res) {

      if ( err) {
        reject(err);
      }
      if (!err) {
        resolve(res);
      }
    });
  });
}