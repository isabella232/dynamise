"use strict";

var dynamo = require("../../dynamo");

function read(client, tableName) {

  if (typeof tableName === "object") {
    tableName = tableName.TableName;
  }

  return dynamo.describeTable(client, tableName);
}

module.exports = read;