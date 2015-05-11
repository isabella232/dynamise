"use strict";

var db = require("../../../../lib");
var testTable = require("../../../support/testTable");

describe("client.active(table)", function () {

  var client;

  beforeEach(function () {
    client = db("local");

    return client.remove(testTable)
      .catch(function () {
        return true;
      })
  });

  it("should throw an error if the maximum of attempts exceeded", function () {
    // TODO: evaluate how I can mock the TableStatus to not ACTIVE
  });

  it("should return 'ACTIVE' if anything is fine", function () {
    // TODO: evaluate how I can mock the TableStatus to ACTIVE
  });

  afterEach(function () {
    return client.remove(testTable)
      .catch(function () {
        return true;
      });
  });
});