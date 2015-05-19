"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;

var rewire = require("rewire");
var active = rewire("../../../../lib/sugar/table/active.js");

describe("client.active(table)", function () {

  var client = require("../../../support/testClient");

  it("should throw an error if the maximum of attempts exceeded", function () {
    active.__set__("read", function () {
      return new Promise(function (resolve) {
        resolve({TableStatus: "DELETING"});
      });
    });

    active.__set__("tries", 60);

    return active('', '').then(function onSuccess() {}, function onError(err) {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.equal("Exceeded number of attempts");
    });
  });

  it("should return 'ACTIVE' if anything is fine", function () {
    active.__set__("read", function () {
      return new Promise(function (resolve) {
        resolve({TableStatus: "ACTIVE"});
      });
    });

    active.__set__("tries", 0)

    return active('','').then(function onSuccess(res) {
      expect(res).to.have.property("TableStatus");
      expect(res.TableStatus).to.equal("ACTIVE");
    });
  });

});