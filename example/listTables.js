"use strict";

var db = require("../lib");

var client = db("local");

client.recreate("Example").then(function(data) {
  console.log("ListTables",data);
})