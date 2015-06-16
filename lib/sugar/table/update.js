"use strict";

var active = require("./active");
var dynamo = require("../../dynamo");

function update(client, params) {
    return dynamo.updateTable(client, params)
      .then(function (res) {
        return active(client, params.TableName)
          .then(function () {
            return res;
          });
      });
}

module.exports = update;