"use strict";

var active = require("./active");
var dynamo = require("../../dynamo");

function remove(client, tableName) {

  if (typeof tableName === "object") {
    tableName = tableName.TableName;
  }

  return active(client, tableName)
    .then(function () {
      return dynamo.deleteTable(client, tableName)
    });
}

module.exports = remove;