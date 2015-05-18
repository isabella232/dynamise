"use strict";

var expect = require("chai").expect;
var db = require("../../../../lib");

describe("client.set(definitions)", function () {

  var client;
  var expectedTableDefinition = {
    test: require("../../../support/testTables").test
  };

  before(function () {
    client = db("local");
  });

  it("should set the correct table definition", function () {

    client.set({
      test: require("../../../support/testTables").test
    });

    expect(client.get()).to.eql(expectedTableDefinition);
  });

});