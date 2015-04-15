"use strict";

var stream = require("stream");
var util = require("util");

//stringify streams converts objects to buffers
//allowing us to pipe to process.stdout
function StringifyStream(){
  stream.Transform.call(this);

  this._readableState.objectMode = false;
  this._writableState.objectMode = true;
}
util.inherits(StringifyStream, stream.Transform);

StringifyStream.prototype._transform = function(obj, encoding, cb){
  this.push(JSON.stringify(obj, null, 2) + "\n");
  cb();
};

var stringifyStream = new StringifyStream();

//convert from objects to strings
stringifyStream.pipe(process.stdout);

var db = require("../lib");

var client = db("local");

client.table("Matrix").download(stringifyStream)
  .then(function () {
    console.log("DONE");
  })
  .catch(function (err) {
    throw err;
  });