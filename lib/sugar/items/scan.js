"use strict";

var promise = require("../../promise");

function scan(client, tableName, params) {
  params = params || {};
  params.TableName = params.TableName || tableName;

  return promise.scan(client, params);
}

module.exports = scan;