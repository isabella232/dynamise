"use strict";

var db = require("../lib");
var client = db("local"),
  tables = require("./tables");

// set tables
client.set(tables);

module.exports = client;