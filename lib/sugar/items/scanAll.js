"use strict";

var scan = require("./scan");

function scanAll(client, tableName, params) {
  var items = [];

  function doScan() {
    return scan(client, tableName, params).then(function (res) {
      items = items.concat(res.Items);
      if (res.LastEvaluatedKey) {
        params.ExclusiveStartKey = res.LastEvaluatedKey;
        return doScan();
      }
      return items;
    }, function (err) {
      console.error(err);
      throw err;
    });
  }

  return doScan();
}

module.exports = scanAll;