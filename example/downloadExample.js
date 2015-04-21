"use strict";

var stream = require("stream");
var util = require("util");

var _ = require("lodash");

//stringify streams converts objects to buffers
//allowing us to pipe to process.stdout
function StringifyStream() {
  stream.Transform.call(this);

  this._readableState.objectMode = false;
  this._writableState.objectMode = true;
}
util.inherits(StringifyStream, stream.Transform);

StringifyStream.prototype._transform = function (obj, encoding, cb) {
  this.push(JSON.stringify(obj, null, 2) + "\n");
  cb();
};

var stringifyStream = new StringifyStream();

//convert from objects to strings
stringifyStream.pipe(process.stdout);

var db = require("../lib");

var client = db("local");

var uploadItems = [];
for (var i = 0; i < 123; i++) {
  uploadItems.push({
    UserId: i.toString(),
    FileId: i + "@epha.com"
  });
}

var items = _.clone(uploadItems);

client.recreate("Example")
  .then(function () {

    client.table("Example").upload(uploadItems)
      .then(function () {
        return client.table("Example").download();
      })
      .then(function (stream) {

        var itemsFromDownloadStream = [];

        stream.on('data', function(data) {
          itemsFromDownloadStream.push(data);
        });

        stream.on('end', function() {
          console.log('# uploaded items:', items.length);
          console.log('# downloaded items:', itemsFromDownloadStream.length);
        })
      })
      .catch(function (err) {
        console.log(err, err.stack);
      });
  });