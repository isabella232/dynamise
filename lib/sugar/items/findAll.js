"use strict";

var dynamo = require("../../dynamo");
var getConditionSugar = require("../utils").getConditionSugar;
var addCondition = require("../utils").addCondition;

function findAll(client, tableName, params) {
  params = params || {};
  params.TableName = params.TableName || tableName;
  params.KeyConditions = params.KeyConditions || {};

  function exec(key, value, operator) {
    if (key && value) {
      addCondition(params, key, value, operator);
    }

    return dynamo.query(client, params);
  }

  return getConditionSugar(exec);
}

module.exports = findAll;