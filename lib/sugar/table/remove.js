"use strict";

var dynamo = require("../../dynamo");

function remove(client, tableName) {

  if (typeof tableName === "object") {
    tableName = tableName.TableName;
  }

  return dynamo.deleteTable(client, tableName)
}

module.exports = remove;