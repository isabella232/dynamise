"use strict";

var db = require("../lib");
var client = db("local");

// set tables
client.set({
  Example: require("./tables/Example")
});

module.exports = client;