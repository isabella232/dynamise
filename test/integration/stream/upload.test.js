"use strict";

var expect = require("chai").expect;
var _ = require("lodash");
var WritableStream = require("stream").Writable;
var testTable = require("../../support/testTables").test;

describe("client.table(tableName).createUploadStream()", function () {

  var client = require("../../support/testClient");

  // Currently we only have one test who needs the database table, therefore
  // we do not need to recreate it before each test. If you add more test,
  // consider this fact.
  before(function () {
    return client.recreate(testTable);
  });

  it("should return an instance of UploadStream", function () {
    var upload = client.table(testTable.TableName).createUploadStream();
    expect(upload).to.be.instanceof(WritableStream);
  });

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
