"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;

describe("client.table(tableName).upsert()", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
  });

  it("should write the item to the database", function () {
    var item = {id: "1", email: "1@epha.com"};

    return client.table(testTable.TableName).upsert(item)
      .then(function () {
        return client.table(testTable.TableName).download();
      })
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0]).to.eql(item);
      });
  });

  it("should replace the item if it already exists in the database", function () {
    var item = {id: "1", email: "1@epha.com"};
    var newItem = {id: "1", email: "2@epha.com"};

    return client.table(testTable.TableName).create(item)
      .then(function () {
        return client.table(testTable.TableName).upsert(newItem);
      })
      .then(function () {
        return client.table(testTable.TableName).download();
      })
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0]).to.eql(newItem);
      });
  });

});