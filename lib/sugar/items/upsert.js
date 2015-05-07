"use strict";

var dynamo = require("../../dynamo");

function upsert(client, tableName, item) {
  var params = {
    Item: item
  };

  return dynamo.putItem(client, tableName, params);
}

module.exports = upsert;