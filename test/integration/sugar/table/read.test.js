"use strict";

var expect = require("chai").expect;

  var db = require("../../../../lib");
  var testTable = require("../../../support/testTable");
  var expectTableNonExistingError = require("../../../support/helpers").expectTableNonExistingError;

  describe("client.read(table)", function () {

    var client;

    beforeEach(function () {
      client = db("local");

      return client.remove(testTable)
        .catch(function () {
          return true;
        });
    });

  it("should fail if table does not exist", function () {

    client.read(testTable)
      .catch(function (err) {
        expectTableNonExistingError(err);
      });
  });

  describe("if the table exists it", function () {

    beforeEach(function () {
      return client.create(testTable);
    });

    it("should return valid table description", function () {

      return client.read(testTable.TableName)
        .then(function (tableDescription) {
          expect(tableDescription).to.be.an("object");

          // testing on expected properties (for details http://docs.aws.amazon.com/cli/latest/reference/dynamodb/describe-table.html)
          expect(tableDescription).to.have.property("AttributeDefinitions");
          expect(tableDescription.AttributeDefinitions).to.eql(testTable.AttributeDefinitions);

          expect(tableDescription).to.have.property("TableName");
          expect(tableDescription.TableName).to.eql(testTable.TableName);

          expect(tableDescription).to.have.property("KeySchema");
          expect(tableDescription.KeySchema).to.eql(testTable.KeySchema);

          expect(tableDescription).to.have.property("TableStatus");
          expect(tableDescription).to.have.property("CreationDateTime");
          expect(tableDescription).to.have.property("ProvisionedThroughput");
          expect(tableDescription).to.have.property("TableSizeBytes");
        });
    });
  });

});