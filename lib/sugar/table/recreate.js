"use strict";

var active = require("./active");
var remove = require("./remove");
var create = require("./create");

function recreate(client, tableName) {

  return active(client, tableName)
    .then(function () {
      return remove(client, tableName);
    })
    .then(function () {
      return active(client, tableName);
    })
    .then(function () {
      return create(client, tableName);
    })
    .catch(function (err) {
      if (err.code === "ResourceNotFoundException") {
        return create(client, tableName);
      }
      throw err;
    })
    .then(function () {
      return active(client, tableName);
    });
}

module.exports = recreate;