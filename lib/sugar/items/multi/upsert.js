"use strict";

var _ = require("lodash");

var dynamo = require("../../../dynamo");
var throttledParallel = require("../../../utils").throttledParallel;

function multiUpsert(client, tables) {

  // blueprint
  var params = {RequestItems: {}};

  // preparation for easier splitting in chunks of 25 items
  var tmp = [];
  Object.keys(tables).forEach(function (table) {
    tables[table].forEach(function (item) {
      tmp.push({table: table, PutRequest: {Item: item}});
    });
  });

  // split into chunks of 25 items
  var chunks = _.chunk(tmp, 25);
  var requests = [];

  chunks.forEach(function (chunk) {
    // create params object
    var tmp = _.clone(params, true);

    chunk.forEach(function (item) {
      if (!(item.table in tmp.RequestItems)) {
        tmp.RequestItems[item.table] = [];
      }
      tmp.RequestItems[item.table].push({PutRequest: item.PutRequest});
    });
    requests.push(tmp);
  });

  function doBatchWrite(items) {
    return dynamo.batchWriteItem(client, items)
      .catch(function (err) {
        err.items = items;
        throw err;
      });
  }

  // finally fire requests, 10 at a time
  return throttledParallel(requests, doBatchWrite)
    .catch(function (err) {
      console.trace(err);
      throw err;
    });
}

module.exports = multiUpsert;