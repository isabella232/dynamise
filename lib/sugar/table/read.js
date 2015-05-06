"use strict";

var promise = require("../../promise");

function read(client, tableName) {

  if (typeof tableName === "object") {
    tableName = tableName.TableName;
  }

  return promise.describeTable(client, tableName)
}

module.exports = read;