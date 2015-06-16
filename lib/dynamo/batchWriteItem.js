"use strict";

var delay = require("../utils").delay;
var calculateRetryDelays = require("../utils").calculateRetryDelays;

module.exports = function batchWriteItem(client, params) {

  var retries = 0;

  function promiseBatchWriteItem(params) {
    return new Promise(function (resolve, reject) {
      client.endpoint.batchWriteItem(params, function (err, res) {
        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }

  function doBatchWriteItem() {

    return promiseBatchWriteItem(params)
      .then(function (res) {
        if (Object.keys(res.UnprocessedItems).length > 0) {
          retries++;
          params.RequestItems = res.UnprocessedItems;

          // exponential backoff
          return delay(calculateRetryDelays(retries)).then(function () {
            return doBatchWriteItem();
          });
        }

        return res;
      });
  }

  return doBatchWriteItem();
};

