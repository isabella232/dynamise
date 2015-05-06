"use strict";

var promise = require("../../promise");

function tableUpsert(client, tableName, item) {
  var params = {
    Item: item
  };

  return promise.putItem(client, tableName, params);
}

module.exports = tableUpsert;