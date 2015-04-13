"use strict";

var transform = require("../transform");

module.exports = function batchWriteItem(client, params) {

  //TODO add retry logic
  return new Promise(function (resolve, reject) {

    //transform to
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

    client.endpoint.batchWriteItem(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};

