"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTable");

describe("client.table(tableName).remove()", function () {

  var client =  require("../../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
  });

  it("should remove the item from the database", function () {
    var item = {id: "1", email: "1@epha.com"};

    return client.table(testTable.TableName).create(item)
      .then(function () {
        return client.table(testTable.TableName).remove(item.id, item.email)
      })
      .then(function (res) {
        return client.table(testTable.TableName).download();
      })
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(0);
      });
  });

});