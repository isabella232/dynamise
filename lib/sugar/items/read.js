"use strict";

var promise = require("../../promise");
var getKey = require("../utils").getKey;

function tableRead(client, tableName, hash, range) {

  var params = {
    Key: getKey(client, tableName, hash, range)
  };

  return promise.getItem(client, tableName, params);
}

module.exports = tableRead;