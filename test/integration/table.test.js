"use strict";

var expect = require("chai").expect;

var db = require("../../lib/");
var testTable = require("../support/testTable");

function expectTableNonExistingError(err) {
  expect(err).to.be.instanceof(Error);
  expect(err.code).to.eql("ResourceNotFoundException");
}

function expectValidTableDescription(table, tableName) {
  expect(table).to.be.an("object");
  expect(table).to.contain.keys(["AttributeDefinitions", "CreationDateTime", "TableSizeBytes"]);
  expect(table.TableName).to.eql(tableName);
}

describe("Items", function () {

  var client;

  this.timeout(5000);

  before(function () {
    db("local").set({test: testTable});
  });

  beforeEach(function () {

    client = db("local");

    return client
      .remove(testTable)
      //we don't care if it did not exist
      .catch(function () {
        return true;
      });
  });

  describe("#scan", function () {

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

        return client.create(testTable)
          .then(function () {
            return client.active(testTable.TableName);
          })
          .then(function () {
            return client.table(testTable.TableName).upload(items);
          });
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

      afterEach(function () {
        return client.remove(testTable.TableName)
          .catch(function () {
            return true;
          });
      });
    });

  });

  describe("#download", function () {

    var items = [];

    beforeEach(function () {

      for (var i = 0; i < 53; i++) {
        items.push({
          "id": "" + i,
          "email": i + "@epha.com"
        });
      }

      return client.create(testTable)
        .then(function () {
          return client.active(testTable.TableName);
        })
        .then(function () {
          return client.table(testTable.TableName).upload(items);
        })
    });

    it("should download all 53 items", function () {

      return client.table(testTable.TableName).download()
        .then(function (data) {
          expect(data).to.be.instanceof(Array);
          expect(data).to.have.length(53);
        });
    });

    afterEach(function () {
      return client.remove(testTable.TableName)
        .catch(function () {
          return true;
        })
    })

  });

});
