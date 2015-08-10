"use strict";

var dynamo = require("../../dynamo");
var read = require("./read");

var compare = [
  "ProvisionedThroughput",
  "ReadCapacityUnits",
  "WriteCapacityUnits"
];

function status(client, tableName) {

  if (typeof tableName === "object") {
    tableName = tableName.TableName;
  }

  return read(client, tableName)
    .then(function (data) {

      return {
        TableSizeBytes: data.TableSizeBytes,
        TableStatus: data.TableStatus,
        ItemCount: data.ItemCount,
        Upgradable: JSON.stringify(data, compare) !== JSON.stringify(client.tables[tableName], compare)
      };
    });
}

module.exports = status;