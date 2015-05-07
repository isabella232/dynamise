"use strict";

var db = require("../lib");
var client = db("local");

// set tables
client.set({
  Example: require("../tables/Example"),
  Matrix: require("../tables/Matrix")
  // TODO add all tables from ../tables
});

module.exports = client;