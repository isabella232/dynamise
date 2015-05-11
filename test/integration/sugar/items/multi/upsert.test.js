"use strict";

var expect = require("chai").expect;

var db = require("../../../../../lib");
var testTable = require("../../../../support/testTable");

describe("client.table(tableName).multiUpsert()", function () {

  var client;

  beforeEach(function () {

    client = db("local");
    client.set({test: testTable});

    return client.remove(testTable)
      .catch(function (err) {
        return true;
      });
  });

  describe("if the database is empty", function () {

    beforeEach(function () {
      return client.create(testTable)
    });

    var items = [];
    for (var i = 1; i < 188; i++) {
      items.push({
        id: "" + i,
        email: i + "@epha.com"
      });
    }

    it("should properly insert all items if database is empty", function () {

      return client.table(testTable.TableName).multiUpsert(items)
        .then(function () {
          return client.table(testTable.TableName).download();
        })
        .then(function (res) {
          // test if arrays have the same length
          expect(res).to.be.instanceof(Array);
          expect(res).to.have.length(items.length);

          // and now test if the items are equal
          res.forEach(function (item) {
            expect(items).to.contain(item);
          });
        });
    });
  });

  describe("if the database is not empty", function () {

    beforeEach(function () {
      return client.create(testTable)
    });

    var items = [];
    for (var i = 1; i < 188; i++) {
      items.push({
        id: "" + i,
        email: i + "@epha.com"
      });
    }

    var slice = items.slice(1, 27);

    it("should properly insert all items and replace existing items", function () {
      return client.table(testTable.TableName).multiUpsert(slice)
        .then(function () {
          items.forEach(function (item) {
            item.checked = true;
          });

          return client.table(testTable.TableName).multiUpsert(items);
        })
        .then(function () {
          return client.table(testTable.TableName).download();
        })
        .then(function (res) {
          // test if arrays have the same length
          expect(res).to.be.instanceof(Array);
          expect(res).to.have.length(items.length);

          // and now test if the items are equal
          res.forEach(function (item) {
            expect(items).to.contain(item);
          });
        });
    });
  });

  afterEach(function () {
    return client.remove(testTable)
      .catch(function () {
        return true;
      });
  });
});