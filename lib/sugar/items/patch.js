"use strict";

var promise = require("../../promise");

function tablePatch(client, tableName, item) {
  var params = {
    Item: item
  };

  return promise.updateItem(client, tableName, params);
}

module.exports = tablePatch;