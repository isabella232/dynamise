"use strict";

var util = require("util"),
  Readable = require("stream").Readable;

/**
 * DownloadStream
 *
 * using the scan method
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

  //still some items left...
  if(this.chunks.length > 0) {
    self.push(this.chunks.shift());
    return;
  }

  //not loaded already
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

  //done!
  this.push(null);
};

module.exports = DownloadStream;