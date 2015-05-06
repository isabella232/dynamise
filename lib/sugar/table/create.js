"use strict";

var dynamo = require("../../dynamo");

function create(client, tableName) {

  if (typeof tableName === "string") {
    tableName = client.tables[tableName];
  }
  return dynamo.createTable(client, tableName)
}

module.exports = create;