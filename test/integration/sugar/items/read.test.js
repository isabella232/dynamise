"use strict";

var expect = require("chai").expect;

var db = require("../../../../lib");
var testTable = require("../../../support/testTable");

describe("client.table(tableName).read()", function () {

  var client;

  beforeEach(function () {
    client = db("local");
    client.set({test: testTable});

    return client.remove(testTable)
      .then(function () {
        // create the table, after removing it
        return client.create(testTable)
      })
      .catch(function () {
        // if the table does not exist, create it
        return client.create(testTable)
      });
  });

  it("should read and return the correct item", function () {
    var items = [];
    for (var i = 0; i < 7; i++) {
      items.push({id: "" + i, email: i + "@epha.com"});
    }

    return client.table(testTable.TableName).upload(items)
      .then(function () {
        return Promise.all(items.map(function (item) {
          return client.table(testTable.TableName).read(item.id, item.email)
            .then(function (res) {
              expect(res).to.eql(item);
            });
        }));
      });
  });

  afterEach(function () {
    return client.remove(testTable)
      .catch(function () {
        return true;
      });
  });
});