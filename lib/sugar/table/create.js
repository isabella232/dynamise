"use strict";

var active = require("../table/active");
var dynamo = require("../../dynamo");

function create(client, tableName) {

  if (typeof tableName === "string") {
    tableName = client.tables[tableName];
  }

  return dynamo.createTable(client, tableName)
    .then(function (res) {
      return active(client, tableName)
        .then(function () {
          return res;
        });
    });
}

module.exports = create;