"use strict";

var path = require("path"),
  fs = require("fs"),
  expect = require("chai").expect,
  _ = require("lodash"),
  JSONStream = require("JSONStream");

var testTable = require("../../support/testTables").test;

describe("client.table(tableName).createUploadStream()", function () {

  var client = require("../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
  });

  // TODO: should return an instance of UploadStream

  it("should create all items in the database writing to the stream manually", function (done) {

    var data = [];

    for (var i = 0; i < 123; i++) {
      data.push({
        id: i.toString(),
        email: i + "@epha.com"
      });
    }

    var expectedData = _.clone(data, true);

    var upload = client.table("test").createUploadStream();

    upload.on("finish", function () {

      Promise.all(expectedData.map(function (element) {
        return client.table("test").read(element.id, element.email)
          .then(function (res) {
            expect(res).not.eql(undefined);
            expect(expectedData).contains(res);
          });
      })).then(function (res) {
        done();
      }, done);
    });

    upload.on("error", done);

    write();

    function write() {
      var ok = true,
        currentItem;

      while (ok && (currentItem = data.shift()) !== undefined) {

        if (data.length === 0) {
          upload.end(currentItem);
          break;
        }

        ok = upload.write(currentItem, function () {
        });

        if (!ok) {
          upload.once("drain", write);
          break;
        }
      }
    }
  });
});
