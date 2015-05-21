"use strict";

var dynamo = require("../../dynamo");

function update(client, params) {
    return dynamo.updateTable(client, params);
}

module.exports = update;