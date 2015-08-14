"use strict";

var db = require("../../lib");
var testTable = require("./testTables").test;

var client = db(process.env.AWS_REGION || "local");
client.set({test: testTable});

module.exports = client;