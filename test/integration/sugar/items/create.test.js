"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTable");

describe("client.table(tableName).create()", function () {

  var client = require("../../../support/testClient");

  var existingItem = {id: "1", email: "1@epha.com"};
  var newItem = {id: "1", email: "2@epha.com"};

  beforeEach(function () {
    return client.recreate(testTable);
  });

  describe("if the item already exists", function () {

    beforeEach(function () {
      return client.table(testTable.TableName).create(existingItem);
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
  });

  describe("if the item does not exist", function () {

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
  });

});