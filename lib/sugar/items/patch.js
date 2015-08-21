"use strict";

var _ = require("lodash");
var dynamo = require("../../dynamo");
var buildKey = require("../utils").buildKey;
var modifyAttributes = require("../utils/modifyAttributes");

function patch(client, tableName, item) {

  var params = {
    Key: buildKey(client, tableName, item),
  };

  var mods = modifyAttributes(item, params.Key);
 
  params.ExpressionAttributeNames = mods.names;
  params.ExpressionAttributeValues = mods.values;
  params.UpdateExpression = mods.expression;

  params = _.chain({}).merge(params).omit(_.isEmpty).value();
  
  return dynamo.updateItem(client, tableName, params)
    .then(function (res) {
      return res.Attributes || {};
    });

}

module.exports = patch;
