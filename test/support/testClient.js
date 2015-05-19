"use strict";

var db = require("../../lib");
var testTable = require("./testTables").test;

var client = db("local");
client.set({test: testTable});

module.exports = client;