"use strict";

var transform = require("../../transform");

function addCondition(params, key, value, operator) {
  //TODO find out why primitives are not working with transform.to / maybe check transform keys of same module
  value = {
    "key": value
  };

  value = transform.to(value).key;
  params.KeyConditions[key] = {
    AttributeValueList: [value],
    ComparisonOperator: operator
  };

  return params;
}

module.exports = addCondition;