"use strict";

var expect = require("chai").expect;

describe("client.endpoint()", function () {
  var endpoint;
  var client = require("../../../lib")("local");

  it.only("should return the 'local' endpoint", function () {
    endpoint = client.endpoint();

    expect(endpoint).to.be.an('object');
    expect(endpoint.hostname).to.eql("localhost");
  });

});