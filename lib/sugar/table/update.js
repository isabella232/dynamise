"use strict";

var active = require("./active");
var dynamo = require("../../dynamo");

function update(client, params) {
    return dynamo.updateTable(client, params)
      // updateTable is an async function, thus we need until the table is active
      .then(function (res) {
        return active(client, params.TableName)
          .then(function () {
            return res;
          });
      });
}

module.exports = update;