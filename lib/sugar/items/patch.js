"use strict";

var inspect = require("util").inspect;

var _ = require("lodash");
var dynamo = require("../../dynamo");
var buildKey = require("../utils").buildKey;
var getKey = require("../utils").getKey;

function patch(client, tableName, item) {

  // TODO: documentation for patch related to add, put, delete
  var params = {
    Key: buildKey(client, tableName, item),
    AttributeUpdates: {}
  };

  for (var key in item) {
    if (item.hasOwnProperty(key)) {

      if (key in params.Key) {
        // we cannot update hash and/or range keys
        continue;
      }

      if (item[key] === null) {
        params.AttributeUpdates[key] = {
          Action: "DELETE"
        };
      }
      else {
        params.AttributeUpdates[key] = {
          Action: "PUT",
          Value: item[key]
        };
      }
    }
  }

  params = _.chain({}).merge(params).omit(_.isEmpty).value();

  return dynamo.updateItem(client, tableName, params);

}

module.exports = patch;