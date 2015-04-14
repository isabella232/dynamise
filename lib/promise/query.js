"use strict";

var transform = require("../transform");

module.exports = function query(client, tableName, params) {

  return new Promise(function (resolve, reject) {

    params = params || {};

    params.TableName = tableName;
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

      if (res.Items) {
        res.Items = res.Items.map(function (item) {
          return transform.from(item);
        });
      }

      resolve(res.Items);
    });
  });
};