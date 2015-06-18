"use strict";

var client = require("./testClient");

var fs = require("fs");
var path = require("path");
var jsonStream = require("JSONStream").parse("*");
var uploadStream = client.table("Example").createUploadStream();

// Read data from a file using fs.createReadStream()
var jsonFileStream = fs.createReadStream(path.resolve(__dirname, "data.json"));

// And now pipe anything to uploadStream
jsonFileStream.pipe(jsonStream).pipe(uploadStream);

uploadStream.on("finish", function () {
  console.log("finished uploading items");
});

uploadStream.on("error", function (err) {
  console.error(err);
});
