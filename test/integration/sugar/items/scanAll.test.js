"use strict";

var expect = require("chai").expect;

var db = require("../../../../lib");
var testTable = require("../../../support/testTable");

describe("scanAll items - client.table(table).scanAll()", function () {

  var client;
  var items = [];

  beforeEach(function () {
    client = db("local");
    client.set({test: testTable});

    for (var i = 0; i < 53; i++) {
      items.push({
        "id": "" + i,
        "email": i + "@epha.com"
      });
    }

    return client.create(testTable)
      .then(function () {
        return client.active(testTable.TableName);
      })
      .then(function () {
        return client.table(testTable.TableName).upload(items);
      })
  });

  it("should download all 53 items", function () {

    return client.table(testTable.TableName).scanAll()
      .then(function (data) {
        expect(data).to.be.instanceof(Array);
        expect(data).to.have.length(53);
      });
  });

  afterEach(function () {
    return client.remove(testTable.TableName)
      .catch(function () {
        return true;
      })
  })
});