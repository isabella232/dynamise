"use strict";

var expect = require("chai").expect;
var _ = require("lodash");
var db = require("../../../../lib");
var testTable = require("../../../support/testTables").test;

describe("client.table(tableName).upload()", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
  });

  it("should create all items passed in the array using multiWrite logic", function () {

    var data = [];

    for (var i = 0; i < 100; i++) {
      data.push({
        id: i.toString(),
        email: i + "@epha.com"
      });
    }

    var expectedData = _.clone(data, true);

    return client.table("test").upload(data)
      .then(function () {
        return Promise.all(expectedData.map(function (element) {
          return client.table("test").read(element.id, element.mail)
            .then(function (res) {
              expect(res).not.eql(undefined);
              expect(expectedData).contains(res);
            })
        }))
      });
  });
});