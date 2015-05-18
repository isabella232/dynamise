"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;

describe("client.active(table)", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
  });

  it("should throw an error if the maximum of attempts exceeded", function () {
    // TODO: evaluate how I can mock the TableStatus to not ACTIVE
  });

  it("should return 'ACTIVE' if anything is fine", function () {
    // TODO: evaluate how I can mock the TableStatus to ACTIVE
  });

});