"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;
var testTable2 = require("../../../support/testTables").test2;

describe("client.table(tableName).find()", function () {

  var client = require("../../../support/testClient");

  var items = [];
  for (var i = 0; i < 18; i++) {
    items.push({id: "0", email: i + "@epha.com"});

    if (i === 1) {
      items.push({id: "1", email: "1@epha.com"});
    }
  }

  before(function () {
    return client.recreate(testTable2).then(function () {
      return client.table(testTable2.TableName).upload(items);
    });
  });

  it("should return an error if KeyConditions is not an Array", function () {
    var params = {
      KeyConditions: {}
    };

    expect(function () {
      client.table(testTable.TableName).find(params)
    }).to.throw(Error);
  });

  it("should return 1 item using hash condition", function () {
    return client.table(testTable2.TableName).find().where("id").equals("1").run()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(items).to.contain(res[0])
      });
  });

  it("should return 1 item using hash and range condition", function () {
    return client.table(testTable2.TableName).find().where("id").equals("1").and("email").equals("1@epha.com").run()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
        expect(items).to.contain(res[0]);
      });
  });

  it("should return no items using hash condition", function () {
    return client.table(testTable2.TableName).find().where("id").equals("17").run()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(0);
      });
  });

  it("should return no items using hash and range condition", function () {
    return client.table(testTable2.TableName).find().where("id").equals("17").and("email").equals("stephan@epha.com").run()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(0);
      });
  });

  it("should return 17 items with id === 0 using a hash condition", function () {
    return client.table(testTable2.TableName).find().where("id").equals("0").run()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(18);
      });
  });

  it("should return 1 item with id === 0 using hash and range condition", function () {
    return client.table(testTable2.TableName).find().where("id").equals("0").and("email").equals("4@epha.com").run()
      .then(function (res) {
        expect(res).to.be.instanceof(Array);
        expect(res).to.have.length(1);
      })
  })


});