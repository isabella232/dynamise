"use strict";

var db = require("../../lib");
var testTable = require("./testTable");

var client = db("local");
client.set({test: testTable});

module.exports = client;