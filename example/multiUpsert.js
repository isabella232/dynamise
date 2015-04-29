'use strict';

var db = require("../lib");
var client = db("local");

var tables = {
  "Example": [],
  "Matrix": []
};

// fill tables object
for (var i = 0; i < 12; i++) {

  tables.Example.push({
    UserId: "" + i,
    FileId: "file#" + i
  });

  tables.Matrix.push({
    Id: "" + i
  });
}

Promise.all([client.recreate("Example"), client.recreate("Matrix")])
  .then(function () {
    return Promise.all([client.active("Example"), client.active("Matrix")])
  })
  .then(function () {
    console.log("Tables recreated and active.");
    return client.multiUpsert(tables);
  })
  .then(function () {
    console.log("MultiUpsert done");
  })
  .catch(function (error) {
    console.trace(err.stack);
    throw error;
  });
