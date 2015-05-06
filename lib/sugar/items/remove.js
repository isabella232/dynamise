"use strict";

var promise = require("../../promise");
var getKey = require("../utils").getKey;

function remove(client, tableName, hash, range) {

  var params = {
    Key: getKey(client, tableName, hash, range)
  };

  return promise.deleteItem(client, tableName, params);
}

module.exports = remove;