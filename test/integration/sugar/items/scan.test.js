"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;

describe("client.table(tableName).scan()", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
  });

  var items = [];
  var limit = 5;

  describe("with 53 items in a database", function () {

    beforeEach(function () {

      for (var i = 0; i < 53; i++) {
        items.push({
          "id": "" + i,
          "email": i + "@epha.com"
        });
      }

      return client.table(testTable.TableName).upload(items);
    });

    it("should scan " + limit + " items with '{Limit: " + limit + "}' param and have a LastEvaluatedKey", function () {

      return client.table(testTable.TableName).scan({Limit: limit})
        .then(function (data) {
          expect(data).to.be.instanceof(Object);
          expect(data.Items).to.be.instanceof(Array);
          expect(data.Items).to.have.length(limit);
          expect(data).to.have.property("LastEvaluatedKey");
        });
    });

    it("should scan 53 items without 'Limit' param", function () {

      return client.table(testTable.TableName).scan()
        .then(function (data) {
          expect(data).to.be.instanceof(Object);
          expect(data.Items).to.be.instanceof(Array);
          expect(data.Items).to.have.length(53);
        });
    });
  });
});