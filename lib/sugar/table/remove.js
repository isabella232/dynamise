"use strict";

var promise = require("../../promise");

function remove(client, tableName) {

  if (typeof tableName === "object") {
    tableName = tableName.TableName;
  }

  return promise.deleteTable(client, tableName)
}

module.exports = remove;