"use strict";

var promise = require("../../promise");
var read = require("./read");

function status(client, tableName) {

  if (typeof tableName === "object") {
    tableName = tableName.TableName;
  }

  return new Promise(function (resolve, reject) {

    var compare = [
      "ProvisionedThroughput",
      "ReadCapacityUnits",
      "WriteCapacityUnits"
    ];

    read(client, tableName).then(function (data) {

      resolve({
        TableSizeBytes: data.TableSizeBytes,
        TableStatus: data.TableStatus,
        ItemCount: data.ItemCount,
        Upgradable: JSON.stringify(data, compare) != JSON.stringify(client.tables[tableName], compare)
      });

    })
      .catch(reject);
  });
}

module.exports = status;