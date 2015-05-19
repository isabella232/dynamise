"use strict";

var transform = require("../transform");
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

  function promiseBatchWriteItem(params, doTransform) {

    return new Promise(function (resolve, reject) {

      //transform to
      if (doTransform) {
        Object.keys(params.RequestItems).forEach(function (table) {

          params.RequestItems[table].forEach(function (request) {

            if (request.DeleteRequest) {
              request.DeleteRequest.Key = transform.to(request.DeleteRequest.Key);
            }

            if (request.PutRequest) {
              request.PutRequest.Item = transform.to(request.PutRequest.Item);
            }
          });
        });
      }

      client.endpoint.batchWriteItem(params, function (err, res) {

        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }

  function doBatchWriteItem(doTransform) {

    return promiseBatchWriteItem(params, doTransform)
      .then(function (res) {

        if (Object.keys(res.UnprocessedItems).length > 0) {
          retries++;
          params.RequestItems = res.UnprocessedItems;
          return delay(calculateRetryDelays(retries)).then(function () {
            return doBatchWriteItem(false, retries);
          });
        }

        return res;
      });
  }

  return doBatchWriteItem(true);
};

