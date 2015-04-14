"use strict";

var util = require("util"),
  Readable = require("stream").Readable;

/**
 * DownloadStream
 *
 * performs multiple get operations
 * using the batchGetItem method
 *
 * Caches up to 100 elements before calling the database
 *
 * @param db
 * @constructor
 */
function DownloadStream(client, tableName, multiRead) {

  this.client = client;
  this.multiRead = multiRead;
  this.tableName = tableName;
  this.chunks = [];

  Readable.call(this, {objectMode: true, highWaterMark: 100});
}

util.inherits(DownloadStream, Readable);

DownloadStream.prototype._read = function() {
  // TODO implement it
}