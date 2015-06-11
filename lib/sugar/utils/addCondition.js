"use strict";

function addCondition(params, key, value, operator) {
  value = {
    "key": value
  };

  value = value.key;
  params.KeyConditions[key] = {
    AttributeValueList: [value],
    ComparisonOperator: operator
  };

  return params;
}

module.exports = addCondition;