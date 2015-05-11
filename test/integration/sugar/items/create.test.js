"use strict";

var expect = require("chai").expect;

var db = require("../../../../lib");
var testTable = require("../../../support/testTable");

var existingItem = {id: "1", email: "1@epha.com"};
var newItem = {id: "1", email: "2@epha.com"};

describe("client.table(tableName).create()", function () {

  var client;

  beforeEach(function () {
    client = db("local");
    client.set({test: testTable});

    return client.remove(testTable)
      .catch(function () {
        return true;
      });
  });

  describe("if the item already exists", function () {

    beforeEach(function () {
      return client.create(testTable)
        .then(function () {
          return client.table(testTable.TableName).create(existingItem);
        })
        .catch(function (err) {
          console.trace(err)
        })
    });

    it("should throw an ConditionalCheckFailedExpression", function () {
      return client.table(testTable.TableName).create(newItem)
        .then(function () {
          return client.table(testTable.TableName).download();
        })
        .catch(function (error) {
          expect(error).to.be.instanceof(Error);
          expect(error.code).to.equal("ConditionalCheckFailedException");
        });
    });

    afterEach(function () {
      return client.remove(testTable)
        .catch(function () {
          return true
        });
    });
  });

  describe("if the item does not exist", function () {

    beforeEach(function () {
      return client.create(testTable);
    });

    it("should write item to the database", function () {
      return client.table(testTable.TableName).create(newItem)
        .then(function () {
          return client.table(testTable.TableName).download();
        })
        .then(function (data) {
          expect(data).to.be.instanceof(Array);
          expect(data).to.have.length(1);
          expect(data[0]).to.eql(newItem);
        });
    });

    afterEach(function () {
      return client.remove(testTable)
        .catch(function () {
          return true;
        });
    });
  });
});