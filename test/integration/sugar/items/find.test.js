"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;

describe("client.table(tableName).find()", function() {

  var client = require("../../../support/testClient");

  var items = [];
  for (var i = 0; i < 18; i++) {
    items.push({id: "0", email: i + "@epha.com"});

    if(i === 1) {
      items.push({id: "1", email: "1@epha.com"});
    }
  }

  before(function () {
    return client.recreate(testTable).then(function () {
      return client.table(testTable.TableName).upload(items);
    });
  });

  it("should return 1 item using hash condition", function () {
    return client.table(testTable.TableName).find().where("id").equals("1").exec()
      .then(function (res) {
        expect(res).to.be.instanceof(Array)
        expect(res).to.have.length(1);
        expect(res[0]).to.eql(items[1])
      });
  });

  it("should return 1 item using hash and range condition", function () {
    return client.table(testTable.TableName).find().where("id").equals("1").and("email").equals("1@epha.com").exec()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0]).to.eql(items[1])
      });
  });

  it("should return no items using hash condition", function () {
    return client.table(testTable.TableName).find().where("id").equals("17").exec()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(0);
      });
  });

  it("should return no items using hash and range condition", function () {
    return client.table(testTable.TableName).find().where("id").equals("17").and("email").equals("stephan@epha.com").exec()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(0);
      });
  });

});