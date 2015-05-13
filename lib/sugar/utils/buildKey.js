"use strict";

var getKey = require("./getKey");

function buildKey(client, tableName, item) {

  var keySchema = client.tables[tableName].KeySchema;

  var hash = keySchema.filter(function (key) {
    return key.KeyType === 'HASH';
  })[0];

  var range = keySchema.filter(function (key) {
    return key.KeyType === 'RANGE';
  })[0];

  if(range === undefined) {
    return getKey(client, tableName, item[hash.AttributeName]);
  }

  return getKey(client, tableName, item[hash.AttributeName], item[range.AttributeName]);
}

module.exports = buildKey;