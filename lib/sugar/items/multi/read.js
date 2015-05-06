"use strict";

var promise = require("../../../promise");

function multiRead(client, params) {
  var tables = {};

  function again() {
    return promise.batchGetItem(client, params).then(function (res) {
      Object.keys(res.Responses).forEach(function (table) {
        tables[table] = tables[table] || [];
        tables[table] = tables[table].concat(res.Responses[table]);
      });
      if (Object.keys(res.UnprocessedKeys).length > 0) {
        params.UnprocessedKeys = res.UnprocessedKeys;
        return again();
      }
      return tables;
    });
  }

  return again();
}

module.exports = multiRead;