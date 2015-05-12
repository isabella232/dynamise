"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTable");

describe("client.table(tableName).scanAll()", function () {

  var client = require("../../../support/testClient");
  var items = [];

  beforeEach(function () {
    for (var i = 0; i < 53; i++) {
      items.push({
        "id": "" + i,
        "email": i + "@epha.com"
      });
    }

    return client.recreate(testTable)
      .then(function () {
        return client.table(testTable.TableName).upload(items);
      });
  });

  it("should download all 53 items", function () {

    return client.table(testTable.TableName).scanAll()
      .then(function (data) {
        expect(data).to.be.instanceof(Array);
        expect(data).to.have.length(53);
      });
  });
});