"use strict";

var delay = require("../../../utils").delay;
var calculateRetryDelays = require("../../../utils").calculateRetryDelays;
var dynamo = require("../../../dynamo");

function multiRead(client, params) {
  var tables = {};
  var retries = 0;

  function again() {
    return dynamo.batchGetItem(client, params).then(function (res) {
      Object.keys(res.Responses).forEach(function (table) {
        tables[table] = tables[table] || [];
        tables[table] = tables[table].concat(res.Responses[table]);
      });

      if (Object.keys(res.UnprocessedKeys).length > 0) {
        retries++;
        params.RequestItems = res.UnprocessedKeys;

        // exponential backoff
        return delay(calculateRetryDelays(retries)).then(function () {
          return again();
        });
      }
      return tables;
    });
  }

  return again();
}

module.exports = multiRead;