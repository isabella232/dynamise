"use strict";

var util = require("util"),
  Writable = require("stream").Writable;

/**
 * Upload Stream
 *
 * Uploads items using a readableStream
 * Uses multiUpsert internally
 *
 * Caches up to 25 elements before calling the database
 *
 *
 * @param client
 * @param {Function} multiUpsert
 * @constructor
 */
function UploadStream(client, multiUpsert) {

  this.client = client;
  this.multiUpsert = multiUpsert;
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

  var self = this,
    lastBufferedRequest = this._writableState.lastBufferedRequest || {};

  this.chunks.push(chunk);

  if(chunk !== lastBufferedRequest.chunk) {
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

/**
 * write all given items to the database
 *
 * @param items
 */
UploadStream.prototype._writeToDb = function (items) {
  return this.multiUpsert(items);
};

module.exports = UploadStream;