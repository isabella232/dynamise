"use strict";

var expect = require("chai").expect;
var testTable = require("../../support/testTables").test;

var ReadableStream = require("stream").Readable;

describe("client.table(tableName).createUploadStream()", function () {

  var client = require("../../support/testClient");

  var expectedItems = [];
  for (var i = 0; i < 16; i++) {
    expectedItems.push({id: "" + i, email: i + "@epha.ch"});
  }

  beforeEach(function () {
    return client.recreate(testTable);
  });

  it("should return an instance of DownloadStream", function () {
    var download = client.table(testTable.TableName).createDownloadStream();
    expect(download).to.be.instanceof(ReadableStream);
  });

  it("should download all items reading from the stream manually", function (done) {
    client.table(testTable.TableName).upload(expectedItems)
      .then(function () {
        var download = client.table(testTable.TableName).createDownloadStream();
        var downloadedItems = [];

        download.on("data", function (chunk) {
          downloadedItems.push(chunk);
        });

        download.on("end", function () {
          expect(downloadedItems).to.have.length(16);
          expectedItems.forEach(function (item) {
            expect(downloadedItems).to.contain(item);
          });
          done();
        });

        download.on("error", done);
      })
      .catch(done);
  });
});