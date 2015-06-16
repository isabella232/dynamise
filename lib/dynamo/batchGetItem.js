"use strict";

module.exports = function batchGetItem(client, params) {

  return new Promise(function (resolve, reject) {
    
    client.endpoint.batchGetItem(params, function (err, res) {

      if(err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};