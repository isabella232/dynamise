"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;
var expectTableNonExistingError = require("../../../support/helpers").expectTableNonExistingError;

describe("client.read(table)", function () {

  var client = require("../../../support/testClient");

  it("should fail if table does not exist", function () {

    return client.remove(testTable)
      .then(function () {
        return client.read(testTable)
      })
      .catch(function (err) {
        expectTableNonExistingError(err);
      });
  });

  describe("if the table exists it", function () {

    beforeEach(function () {
      return client.recreate(testTable);
    });

    it("should return valid table description", function () {

      return client.read(testTable.TableName)
        .then(function (tableDescription) {
          expect(tableDescription).to.be.an("object");

          // testing on expected properties (for details http://docs.aws.amazon.com/cli/latest/reference/dynamodb/describe-table.html)
          expect(tableDescription).to.have.property("AttributeDefinitions");
          testTable.AttributeDefinitions.forEach(function (definition) {
            expect(tableDescription.AttributeDefinitions).to.contain(definition);
          });

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