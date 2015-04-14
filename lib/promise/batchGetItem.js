"use strict";

var transform = require("../transform");

module.exports = function batchGetItem(client, params) {

  return new Promise(function (resolve, reject) {

    //transform to
    Object.keys(params.RequestItems).forEach(function (table) {

      if (Array.isArray(params.RequestItems[table].Keys)) {

        params.RequestItems[table].Keys.map(function (key) {
          return transform.to(key);
        });
      }

    });

    client.endpoint.batchGetItem(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
}