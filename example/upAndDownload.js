"use strict";

var db = require("../lib");

var client = db("local");

var items = [],
  lasts,
  download = [];


for (var i = 0; i < 3620; i++) {
  items.push({
    UserId: "" + i,
    FileId: "File#" + i
  });
}

console.log("Number of items to upload:", items.length);

client.recreate("Example")
  .then(function () {
    return client.active("Example");
  })
  .then(function () {
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
    throw err;
  });