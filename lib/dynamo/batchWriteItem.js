"use strict";

var delay = require("../utils").delay;

/**
 * Calculate the amount of time needed for an exponential backoff to wait
 * before retrying a request
 *
 * NOTICE:
 * Taken from https://github.com/aws/aws-sdk-php/blob/master/src/Aws/DynamoDb/DynamoDbClient.php
 * with little customization
 *
 * Mainly to use in combination with delay(ms).
 *
 * @param {number} retries
 * @returns {number} Returns the amount of time to wait in milliseconds
 */
function calculateRetryDelays(retries) {
  return retries === 0 ? 0 : (50 * Math.pow(2, retries - 1));
}

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
          return delay(calculateRetryDelays(retries)).then(function () {
            return doBatchWriteItem();
          });
        }

        return res;
      });
  }

  return doBatchWriteItem();
};

