"use strict";

var transform = require("../transform");

module.exports = function batchGetItem(client, params) {

  return new Promise(function (resolve, reject) {

    client.endpoint.batchGetItem(params, function (err, res) {

      if(err) {
        reject(err);
        return;
      }
      
      if(res) {
        // Retransform
        Object.keys(res.Responses).forEach(function(table) {
          res.Responses[table] = res.Responses[table].map( function(item) {
            return transform.from(item);
          });
        });
        
        resolve(res);
      }

    });
  });
}