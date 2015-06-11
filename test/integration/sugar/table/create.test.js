"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;
var expectValidTableDescription = require("../../../support/helpers").expectValidTableDescription;

var delay = require("../../../../lib/utils").delay;

describe("client.create(table)", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.remove(testTable)
      .catch(function () {
        return true;
      });
  });

  it("should fail if table already exists", function () {
    return client.recreate(testTable)
      .then(function () {
        return client.create(testTable);
      })
      .catch(function (err) {
        expect(err).to.be.instanceof(Error);
        expect(err.code).to.eql("ResourceInUseException");
      });
  });

  it("should create a table if passed a valid object", function () {
    return delay(500)
      .then(function () {
        return client.create(testTable);
      })
      .then(function (res) {
        expectValidTableDescription(res.TableDescription, "test");
      });
  });

  it("should create a table if passed a table name and table has been registered before", function () {
    return delay(500)
      .then(function () {
        return client.create(testTable);
      })
      .then(function (res) {
        expectValidTableDescription(res.TableDescription, "test");
      });
  });
});
