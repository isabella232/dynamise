"use strict";

var expect = require("chai").expect;

var db = require("../../../../lib");

describe("client.set(definitions)", function () {

  var client;
  var expectedTableDefinition = {
    test: require("../../../support/testTable")
  };

  before(function () {
    client = db("local");
  });

  it("should set the correct table definition", function () {

    client.set({
      test: require("../../../support/testTable")
    });

    expect(client.get()).to.eql(expectedTableDefinition);
  });

});