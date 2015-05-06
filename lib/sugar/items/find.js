"use strict";

var promise = require("../../promise");
var getConditionSugar = require("../utils").getConditionSugar;
var addCondition = require("../utils").addCondition;

function find(client, tableName, params) {

  var conditionCnt = 0;

  params = params || {};
  params.TableName = params.TableName || tableName;
  params.KeyConditions = params.KeyConditions || {};

  function exec(key, value, operator) {
    if (key && value) {
      addCondition(params, key, value, operator);
    }

    if (++conditionCnt === 2) {
      return promise.query(client, params);
    }

    return getConditionSugar(exec);
  }

  return getConditionSugar(exec);
}

module.exports = find;