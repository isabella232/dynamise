"use strict";

var client = require("./testClient");

var items = [
  {UserId:"1", FileId:"2", Email: "m@epha.com"},
  {UserId:"1", FileId:"3", Email: "d@epha.com"}
];

client.recreate("Example")
  .then(function() {
    console.log("Attempting to upload items.");
    return client.table("Example").upload(items);
  })
  .then(function () {
    console.log("Attempting to read items.");
    var keys = items.map(function (item) {
      return {UserId: item.UserId, FileId: item.FileId}
    });
    return client.table("Example").multiRead(keys)
  })
  .then(function (res) {
    console.log(res);
  })
  .catch(function (err) {
    console.trace(err.stack);
  });