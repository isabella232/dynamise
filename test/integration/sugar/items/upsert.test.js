"use strict";

var expect = require("chai").expect;

var db = require("../../../../lib");
var testTable = require("../../../support/testTable");

describe("client.table(tableName).upsert()", function () {

  var client;

  beforeEach(function () {
    client = db("local");
    client.set({test: testTable});

    return client.remove(testTable)
      .then(function () {
        // create the table, after removing it
        return client.create(testTable)
      })
      .catch(function () {
        // if the table does not exist, create it
        return client.create(testTable)
      });
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
        return client.table(testTable.TableName).download()
      })
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0]).to.eql(newItem);
      });
  });

  afterEach(function () {
    return client.remove(testTable)
      .catch(function () {
        return true;
      });
  });
});