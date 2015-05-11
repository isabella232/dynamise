"use strict";

var expect = require("chai").expect;

var db = require("../../../../lib");
var testTable = require("../../../support/testTable");
var expectTableNonExistingError = require("../../../support/helpers").expectTableNonExistingError;

describe("client.listTables()", function () {

  var client;

  beforeEach(function () {
    client = db("local");

    return client.listTables()
      .then(function (tables) {
        return Promise.all(tables.TableNames.map(client.remove))
      })
      .then(function () {
        return client.create(testTable);
      })
      .catch(function (err) {
        console.trace(err);
        return true;
      });
  });

  it("should return a valid tables object with all existing tables", function () {

    return client.listTables()
      .then(function (tables) {
        expect(tables).to.have.property("TableNames");
        expect(tables.TableNames).to.be.instanceof(Array);
        expect(tables.TableNames).to.have.length(1);
        expect(tables.TableNames).to.contain(testTable.TableName);
      });
  });

  afterEach(function () {

    return client.listTables()
      .then(function (tables) {
        return Promise.all(tables.TableNames.map(client.remove))
      })
      .catch(function (err) {
        console.trace(err);
        return true;
      });
  })

});