"use strict";

var dynamo = require("../../dynamo");

function listTables(client, params) {
  return dynamo.listTables(client, params);
}

module.exports = listTables;