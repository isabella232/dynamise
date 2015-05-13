"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTable");

var transform = require("../../../../lib/transform");

describe("client.table(tableName).patch", function () {

  var client = require("../../../support/testClient");

  var item = {
    id: "1",
    email: "m@epha.com",
    role: "admin",
    points: "3",
    more: "no",
    others: "1"
  };

  beforeEach(function () {
    return client.recreate(testTable)
      .then(function () {
        return client.table(testTable.TableName).create(item);
      });
  });

  it("should delete an attribute with value 'null' (Action: DELETE)", function () {
    return client.table(testTable.TableName).patch({
      id: item.id,
      more: null,
      others: null
    })
      .then(function (res) {
        return client.table(testTable.TableName).download()
      })
      .then(function (res) {
        expect(res[0]).to.eql({
          id: item.id,
          email: item.email,
          role: item.role,
          points: item.points
        });
      });
  });

  it("should update an attribute with given value (Action: PUT)", function () {
    return client.table(testTable.TableName).patch({
      id: item.id,
      email: "d@epha.com",
      role: "member",
      points: "4",
      more: "yes",
      others: "2"
    })
      .then(function (res) {
        return client.table(testTable.TableName).download()
      })
      .then(function (res) {
        expect(res[0]).to.eql({
          id: item.id,
          email: "d@epha.com",
          role: "member",
          points: "4",
          more: "yes",
          others: "2"
        });
      });
  });

  it("should do nothing if no action is specified", function () {
    return client.table(testTable.TableName).patch({
      id: item.id
    })
      .then(function (res) {
        return client.table(testTable.TableName).download()
      })
      .then(function (res) {
        expect(res[0]).to.eql(item);
      });
  })

});