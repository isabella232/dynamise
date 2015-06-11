"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;

var rewire = require("rewire");
var active = rewire("../../../../lib/sugar/table/active.js");

describe("client.active(table)", function () {
  
  it("should throw an error if the maximum of attempts exceeded", function (done) {
    active.__with__({
      read: function () {
        return new Promise(function (resolve) {
            resolve({TableStatus: "DELETING"});
          }
        )}
    })(function () {
      active.maxRetries = 2;
      active.retryDelay = 50;
      return active('', '');
    })
      .then(function () {
        done(new Error("should not be resolved"));
      })
      .catch(function (err) {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal("Exceeded number of attempts");
        done();
      });
  });

  it("should return 'ACTIVE' if anything is fine", function (done) {
    active.__with__({
      read: function () {
        return new Promise(function (resolve) {
            resolve({TableStatus: "ACTIVE"});
          }
        )}
    })(function () {
      active.maxRetries = 2;
      active.retryDelay = 50;
      return active('', '');
    })
      .then(function (res) {
        expect(res).to.have.property("TableStatus");
        expect(res.TableStatus).to.equal("ACTIVE");
        done();
      });
  });

});