"use strict";

var active = require("./active");
var status = require("./status");
var dynamo = require("../../dynamo");
var delay = require("../../../lib/utils").delay;

function remove(client, tableName) {

  if (typeof tableName === "object") {
    tableName = tableName.TableName;
  }

  return active(client, tableName)
    .then(function () {
      return dynamo.deleteTable(client, tableName)
    })
    .then(function (res) {

      var tries = 0;

      function waitUntilTableDoesNotExistAnymore(res) {
        if (++tries >= 25) {
          throw new Error("Exceed number of attempts");
        }
        return status(client, tableName)
          .then(function () {
            return delay(2000).then(function () {
              return waitUntilTableDoesNotExistAnymore(res)
            });
          })
          .catch(function (err) {
            if (err.code === "ResourceNotFoundException") {
              return res;
            }
            throw err;
          });
      }
      return waitUntilTableDoesNotExistAnymore(res);
    });

}

module.exports = remove;