"use strict";

function getKey(client, tableName, hash, range) {

  var keySchema = {};

  if (typeof hash === "object" && range === undefined) {
    keySchema = hash;
  }

  if (typeof hash !== "object") {
    var schema = client.tables[tableName].KeySchema;
    var defHash = schema.filter(function (key) {
      return key.KeyType === "HASH";
    });
    var defRange = schema.filter(function (key) {
      return key.KeyType === "RANGE";
    });

    if (defHash.length > 0 && hash !== undefined) {
      keySchema[defHash[0].AttributeName] = hash;
    }
    if (defRange.length > 0 && range !== undefined) {
      keySchema[defRange[0].AttributeName] = range;
    }
  }

  return keySchema;
}

module.exports = getKey;