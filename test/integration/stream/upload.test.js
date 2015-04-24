"use strict";

var path = require("path"),
  fs = require("fs"),
  expect = require("chai").expect,
  _ = require("lodash"),
  JSONStream = require("JSONStream");

var db = require("../../../lib/");
var testTable = require("../../support/testTable");

describe("Table", function () {

  var client;

  this.timeout(5000);

  before(function () {
    db("local").set({test: testTable});
  });

  beforeEach(function () {

    client = db("local");

    client.set({
      "test": testTable
    });

    return client
      .remove("test")
      //we don't care if it did not exist
      .catch(function () {
        return true;
      })
      .then(function () {
        return client.create("test");
      })
      .then(function (res) {
        return client.active("test");
      });
  });

  describe("UploadStream", function () {

    describe("as a stream", function () {

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

    describe("with promise syntax passing an array", function () {

      it("should create all items passed in the array using multiWrite logic", function () {

        var data = [];

        for (var i = 0; i < 100; i++) {
          data.push({
            id: i.toString(),
            email: i + "@epha.com"
          });
        }

        var expectedData = _.clone(data, true);

        return client.recreate("test")
          .then(function () {
            return client.active("test");
          })
          .then(function () {
            return client.table("test").upload(data);
          })
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
  });
});