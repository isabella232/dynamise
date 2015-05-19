"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;

describe("client.table(tableName).read()", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
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
});