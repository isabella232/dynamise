"use strict";

var client = require("./testClient");

client.listTables()
  .then(function (data) {
    console.log("List Tables", data);
  })
  .catch(function (err) {
    throw err;
  });