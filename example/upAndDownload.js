"use strict";

var db = require("../lib");

var client = db("local");

var items = [],
  lasts,
  download = [];


for (var i = 0; i < 3623; i++) {
  items.push({
    UserId: "" + i,
    FileId: "File#" + i
  });
}

console.log("Number of items to upload:", items.length);

client.recreate("Example")
  .then(function () {
    console.log("Waiting for database to be active...");
    return client.active("Example");
  })
  .then(function () {
    console.log("Database is now active.");
    console.log("Now starting to upload items...");
    lasts = Date.now();
    return client.table("Example").upload(items);
  })
  .then(function () {
    console.log("Finished uploading items. Took about", (Date.now() - lasts) / 1000, "seconds.");
    console.log("Now starting to download them again.");
    return client.table("Example").download();
  })
  .then(function (stream) {
    stream.on('data', function(item) {
      download.push(item);
    });

    stream.on('end', function() {
      console.log("Downloaded", download.length, "items");
    });
  })
  .catch(function (err) {
    console.trace(err.stack);
    throw err;
  });