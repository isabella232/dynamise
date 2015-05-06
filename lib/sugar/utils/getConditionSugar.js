"use strict";

function getConditionSugar(exec) {
  return {
    where: function (key) {
      //TODO check of key in tableDescription
      return {
        beginsWith: function (value) {
          return exec(key, value, "BEGINS_WITH");
        },
        equals: function (value) {
          return exec(key, value, "EQ");
        },
        lt: function (value) {
          return exec(key, value, "LT");
        },
        le: function (value) {
          return exec(key, value, "LE");
        },
        between: function (value) {
          return exec(key, value, "BETWEEN");
        },
        gt: function (value) {
          return exec(key, value, "GT");
        },
        ge: function (value) {
          return exec(key, value, "GE");
        }
      };
    }
  };
}

module.exports = getConditionSugar;