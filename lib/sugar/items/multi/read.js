"use strict";

var dynamo = require("../../../dynamo");

function multiRead(client, params) {
  var tables = {};

  function again() {
    return dynamo.batchGetItem(client, params).then(function (res) {
      Object.keys(res.Responses).forEach(function (table) {
        tables[table] = tables[table] || [];
        tables[table] = tables[table].concat(res.Responses[table]);
      });
      if (Object.keys(res.UnprocessedKeys).length > 0) {
        params.UnprocessedKeys = res.UnprocessedKeys;
        // TODO implement exponential backoff
        return again();
      }
      return tables;
    });
  }

  return again();
}

module.exports = multiRead;