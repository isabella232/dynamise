"use strict";

var dynamo = require("../../dynamo");

function tablePatch(client, tableName, item) {
  var params = {
    Item: item
  };

  return dynamo.updateItem(client, tableName, params);
}

module.exports = tablePatch;