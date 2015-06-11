"use strict";

module.exports = function scan(client, params) {
  return new Promise(function(resolve, reject) {

    params = params || {};

    client.endpoint.scan(params, function(err, res) {
      if(err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};