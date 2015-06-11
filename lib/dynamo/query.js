"use strict";

module.exports = function query(client, params) {

  return new Promise(function (resolve, reject) {

    // params.KeyConditions
    params.Select = params.Select || "ALL_ATTRIBUTES";
    // params.Limit 3
    // Default true only if IndexName is available to false
    params.ConsistentRead = (!params.IndexName);
    params.ReturnConsumedCapacity = params.ReturnConsumedCapacity || "TOTAL";

    client.endpoint.query(params, function (err, res) {

      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};