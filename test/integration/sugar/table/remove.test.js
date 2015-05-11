"use strict";

var expect = require("chai").expect;

var db = require("../../../../lib");
var testTable = require("../../../support/testTable");
var expectTableNonExistingError = require("../../../support/helpers").expectTableNonExistingError;

describe("client.remove(table)", function () {

  var client;

  beforeEach(function () {
    client = db("local");

    return client.remove(testTable)
      //we don't care if it did not exist
      .catch(function () {
        return true;
      });
  });


  it("should throw 'ResourceNotFoundException' if table is missing", function () {

    return client.remove("NonExisting")
      .catch(function (err) {
        expectTableNonExistingError(err);
      });
  });


  it("should delete the table and return table data if table exists", function () {

    return client
      .create(testTable)
      .then(function (data) {
        return client.remove(testTable);
      })
      .then(function (res) {
        expect(res).to.be.an("object");
        expect(res.TableDescription.TableName).to.eql("test");
      });
  });
});