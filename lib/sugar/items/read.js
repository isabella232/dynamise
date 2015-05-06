"use strict";

var dynamo = require("../../dynamo");
var getKey = require("../utils").getKey;

function read(client, tableName, hash, range) {

  var params = {
    Key: getKey(client, tableName, hash, range)
  };

  return dynamo.getItem(client, tableName, params);
}

module.exports = read;