"use strict";

var client = require("./testClient");
var testTable = client.get("Example");

/**
 * Pagination
 *
 * @param client
 * @param table
 * @returns {Pagination}
 * @constructor
 */
function Pagination(client, table) {
  this.client = client;
  this.table = table;
  this.LastEvaluatedKey = undefined;
  return this;
}

/**
 * Fetch the next 'limit' (number) values
 *
 * @param limit
 * @returns {Promise}
 */
Pagination.prototype.next = function (limit) {
  var self = this;
  var params = {
    Limit: limit || 10
  };

  if (self.LastEvaluatedKey) {
    params.ExclusiveStartKey = self.LastEvaluatedKey
  }

  return self.client.table(self.table.TableName).scan(params)
    .then(function (res) {
      if (res.LastEvaluatedKey) {
        self.LastEvaluatedKey = res.LastEvaluatedKey
      } else {
        self.LastEvaluatedKey = undefined;
      }
      return Promise.resolve(res);
    });
};

/**
 * Are there still more values to fetch?
 *
 * @returns {boolean}
 */
Pagination.prototype.hasMore = function () {
  return this.LastEvaluatedKey !== undefined;
};

/* ------------- */
/* EXAMPLE USAGE */
/* ------------- */
var paginationExample = new Pagination(client, testTable);

paginationExample.next(10)
  .then(function (res) {
    // process items
    console.log(res.Items);

    // are there any more values to fetch?
    if (paginationExample.hasMore()) {
      console.log("There are still more values to fetch");
    }
  })
  .catch(console.error);