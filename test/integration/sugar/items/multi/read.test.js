"use strict";

var expect = require("chai").expect;

var db = require("../../../../../lib");
var testTable = require("../../../../support/testTable");

describe("client.table(tableName).multiRead()", function () {

  var client;

  beforeEach(function () {
    client = db("local");
    client.set({test: testTable});

    return client.remove(testTable)
      .then(function () {
        return client.create(testTable);
      })
      .catch(function () {
        return client.create(testTable);
      });
  });

  it("return the correct items for one table", function () {
    var items = [];
    for (var i = 0; i < 11; i++) {
      items.push({id: "" + i, email: i + "@epha.com"});
    }

    var RequestItems = [
      {id: "1"},
      {id: "2"}
    ];

    var params = {
      "RequestItems": {
        "test": {
          Keys: RequestItems
        }
      }
    };

    return client.table(testTable.TableName).upload(items)
      .then(function () {
        return client.multiRead(params);
      })
      .then(function (res) {
        expect(res).to.be.instanceof(Object);

        res[testTable.TableName].forEach(function (item) {
          expect(items).to.contain(item);
        });
      });
  });

  afterEach(function () {
    return client.remove(testTable)
      .catch(function () {
        return true;
      });
  });


});