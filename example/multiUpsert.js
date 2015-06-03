'use strict';

var client = require("./testClient");

var tables = {
  "Example": [],
  "Example2": []
};

// fill tables object
for (var i = 0; i < 257; i++) {

  tables.Example.push({
    UserId: "" + i,
    FileId: "file#" + i
  });

  tables.Example2.push({
    Id: "" + i
  });
}

Promise.all([client.recreate("Example"), client.recreate("Example2")])
  .then(function () {
    return Promise.all([client.active("Example"), client.active("Example2")]);
  })
  .then(function () {
    console.log("Tables recreated and active.");
    return client.multiUpsert(tables);
  })
  .then(function () {
    console.log("MultiUpsert done");
  })
  .catch(function (error) {
    console.trace(error.stack);
    throw error;
  });
