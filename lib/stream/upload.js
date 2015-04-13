"use strict";

var util = require("util"),
  Writable = require("stream").Writable;

/**
 * Upload Stream
 *
 * performs multiple put operations
 * using the batchWriteItem method
 *
 * Caches up to 25 elements before calling the database
 *
 * @param db
 * @constructor
 */
function UploadStream(client, tableName, multiUpsert) {

  this.client = client;
  this.multiUpsert = multiUpsert;
  this.tableName = tableName;
  this.chunks = [];

  Writable.call(this, {objectMode: true, highWaterMark: 25});
}

util.inherits(UploadStream, Writable);

/**
 * cache chunk and write to db as soon as we reached 25 chunks
 * the callback does not necessarily mean that the item was written
 * but rather that it has been cached
 *
 * @param chunk
 * @param encoding
 * @param callback
 * @private
 */
UploadStream.prototype._write = function (chunk, encoding, callback) {

  var self = this;
  this.chunks.push(chunk);

  if (this.chunks.length < 25 && chunk !== this.lastChunk) {
    setImmediate(callback);
    return;
  }

  this._writeToDb(this.chunks)
    .then(
    function onSuccess() {
      self.chunks = [];
      callback();
    },
    function onError(err) {
      callback(err);
    });
};

var superEnd = UploadStream.prototype.end;

/**
 * overwrite original end to mark the latest chunk
 * when write is called with the latest chunk, we
 * flush no matter how many chunks are currently buffered
 *
 * @param chunk
 * @param encoding
 * @param cb
 */
UploadStream.prototype.end = function(chunk, encoding, cb) {

  //mark last chunk to trigger flushing
  this.lastChunk = chunk;
  superEnd.apply(this, arguments);
};

/**
 * write all given items to the database
 *
 * @param items
 */
UploadStream.prototype._writeToDb = function (items) {
  return this.multiUpsert(this.client, this.tableName, items);
};

module.exports = UploadStream;