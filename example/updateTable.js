"use strict";

var client = require("./testClient");

client.recreate("Example")
  .then(function () {
    console.log("Created table 'Example' with Provisioned Throughput:", client.get().Example.ProvisionedThroughput);

    var params = {
      TableName: "Example",
      ProvisionedThroughput:{
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    return client.update(params);
  })
  .then(function () {
    return client.read("Example");
  })
  .then(function (res) {
    console.log(res.ProvisionedThroughput);
  })
  .catch(function (err) {
    console.trace(err.stack);
  });