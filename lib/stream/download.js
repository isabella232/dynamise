"use strict";

var util = require("util"),
  Readable = require("stream").Readable;

/**
 * DownloadStream
 *
 * Uses the scanAll method to download all item from the database
 * Returns a readable stream in objectMode, so it has to be converted if
 * consumed by a Stream in BufferMode (i.e. process.stdout, httpResponse)
 *
 * See http://stackoverflow.com/questions/21124701/creating-a-node-js-readable-stream-from-a-javascript-object-the-simplest-possi
 *
 * @param client
 * @param {Function} scanAll
 * @constructor
 */
function DownloadStream(client, scanAll) {

  this.client = client;
  this.scanAll = scanAll;
  this.chunks = [];
  this.loaded = false;

  Readable.call(this, {objectMode: true, highWaterMark: 100 });
}

util.inherits(DownloadStream, Readable);

DownloadStream.prototype._read = function () {

  var self = this;

  //still some items left
  if(this.chunks.length > 0) {
    self.push(this.chunks.shift());
    return;
  }

  //not loaded yet
  if(this.chunks.length === 0 && !this.loaded) {

    self.scanAll()
    .then(function(items) {
        self.loaded = true;
        self.chunks = items;
        self.push(self.chunks.shift());
      }, function(err) {
        throw err;
      });

    return;
  }

  //no items left
  this.push(null);
};

module.exports = DownloadStream;