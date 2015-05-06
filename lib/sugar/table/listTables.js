"use strict";

var promise = require("../../promise");

function listTables(client, params) {
  return promise.listTables(client, params);
}

module.exports = listTables;