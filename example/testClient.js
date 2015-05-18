"use strict";

var db = require("../lib");
var client = db("local");

// set tables
client.set({
  Example: require("./tables/Example"),
  Matrix: require("./tables/Matrix")
});

module.exports = client;