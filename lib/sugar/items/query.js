"use strict";

var dynamo = require("../../dynamo");

function tableQuery(client, tableName, params) {
  params = params || {};
  params.TableName = params.TableName || tableName;

  return dynamo.query(client, params);
}

module.exports = tableQuery;