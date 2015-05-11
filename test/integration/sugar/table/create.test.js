"use strict";

var expect = require("chai").expect;

var db = require("../../../../lib");
var testTable = require("../../../support/testTable");
var expectValidTableDescription = require("../../../support/helpers").expectValidTableDescription;

describe("client.create(table)", function () {

  var client;

  beforeEach(function () {
    client = db("local");

    return client.remove(testTable)
      //we don't care if it did not exist
      .catch(function () {
        return true;
      });
  });

  it("should fail if table already exists", function () {

    return client
      .create(testTable)
      .then(function () {
        return client.create(testTable);
      })
      .catch(function (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.code).to.eql("ResourceInUseException");
      });
  });

  it("should create a table if passed a valid object", function () {

    return client
      .create(testTable)
      .then(function (res) {
        expectValidTableDescription(res.TableDescription, "test");
      });
  });

  it("should create a table if passed a table name and table has been registered before", function () {

    return client
      .create(testTable)
      .then(function (res) {
        expectValidTableDescription(res.TableDescription, "test");
      });
  });
});
