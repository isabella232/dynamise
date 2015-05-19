"use strict";

var dynamo = require("../../dynamo");
var getKey = require("../utils").getKey;

function remove(client, tableName, hash, range) {

  var params = {
    Key: getKey(client, tableName, hash, range)
  };

  return dynamo.deleteItem(client, tableName, params);
}

module.exports = remove;