"use strict";

var promise = require("../../promise");

function tableQuery(client, tableName, params) {
  params = params || {};
  params.TableName = params.TableName || tableName;

  return promise.query(client, params);
}

module.exports = tableQuery;