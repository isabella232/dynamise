"use strict";

var dynamo = require("../../dynamo");

function tableUpsert(client, tableName, item) {
  var params = {
    Item: item
  };

  return dynamo.putItem(client, tableName, params);
}

module.exports = tableUpsert;