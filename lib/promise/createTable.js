"use strict";

module.exports = function(client, tableDefinition ) {

  if(typeof tableDefinition === "string") {
    tableDefinition = client.tables[tableDefinition];
  }

  return new Promise(function (resolve, reject) {

    client.endpoint.createTable(tableDefinition, function (err, res) {
      if ( err) {
        reject(err);
      }
      if (!err) {
        resolve(res);
      }
    });
  });
};