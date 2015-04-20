"use strict";

var db = require("../lib");

var client = db("local");

client.listTables()
  .then(function (data) {
    console.log("List Tables", data);
  })
  .catch(function (err) {
    throw err;
  });