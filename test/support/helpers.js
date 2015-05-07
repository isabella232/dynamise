"use strict";

var expect = require("chai").expect;

function expectTableNonExistingError(err) {
  expect(err).to.be.instanceof(Error);
  expect(err.code).to.eql("ResourceNotFoundException");
}

function expectValidTableDescription(table, tableName) {
  expect(table).to.be.an("object");
  expect(table).to.contain.keys(["AttributeDefinitions", "CreationDateTime", "TableSizeBytes"]);
  expect(table.TableName).to.eql(tableName);
}

exports.expectTableNonExistingError = expectTableNonExistingError;
exports.expectValidTableDescription = expectValidTableDescription;