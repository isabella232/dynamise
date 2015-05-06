"use strict";

var dynamo = require("../../dynamo");

function scan(client, tableName, params) {
  params = params || {};
  params.TableName = params.TableName || tableName;

  return dynamo.scan(client, params);
}

module.exports = scan;