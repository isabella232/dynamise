"use strict";

var promise = require("../../promise");

function create(client, tableName) {

  if (typeof tableName === "string") {
    tableName = client.tables[tableName];
  }
  return promise.createTable(client, tableName)
}

module.exports = create;