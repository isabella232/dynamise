"use strict";

var dynamo = require("../../dynamo");
var transform = require("../../transform");

function create(client, tableName, item) {
      var condition = "";
      var names = {};
      var values = {};
      var keys = client.tables[tableName].KeySchema;

      // HASH
      if (keys.length > 0) {
        condition = "#key1 <> :key1";
        names["#key1"] = keys[0].AttributeName;
        values[":key1"] = transform.to(item)[keys[0].AttributeName];
      }
      // RANGE
      if (keys.length > 1) {
        condition += " OR #key2 <> :key2";
        names["#key2"] = keys[1].AttributeName;
        values[":key2"] = transform.to(item)[keys[1].AttributeName];
      }

      var params = {
        Item: item,
        ConditionExpression: condition,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values
      };

      return dynamo.putItem(client, tableName, params);
}

module.exports = create;