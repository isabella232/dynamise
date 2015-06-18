"use strict";

var fs = require("fs");
var path = require("path");
var expect = require("chai").expect;
var _ = require("lodash");
var WritableStream = require("stream").Writable;
var testTable = require("../../support/testTables").test;
var testTable2 = require("../../support/testTables").test2;

describe("client.table(tableName).createUploadStream()", function () {

  var client = require("../../support/testClient");

  beforeEach(function () {
    return Promise.all([client.recreate(testTable), client.recreate(testTable2)]);
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
      var ok = true;
      var currentItem;

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

  it("should write all items to the table using a JSONStream", function () {
    var dataFile = path.resolve(__dirname, '..', '..', 'support', 'testData.json');

    var dataStream = fs.createReadStream(dataFile);
    var data = require(dataFile);
    var jsonStream = require("JSONStream").parse("*");
    var uploadStream = client.table(testTable.TableName).createUploadStream();

    return new Promise(function (resolve, reject) {
      dataStream.pipe(jsonStream).pipe(uploadStream);

      uploadStream.on("finish", function () {
        client.table(testTable.TableName).download()
          .then(function (res) {
            res.map(function (obj) {
              expect(data).to.contain(obj);
            });
            resolve();
          });
      });

      uploadStream.on("error", reject);
    });
  });

  it("should transfer all data from one table to another using download/upload stream", function () {
    var downloadStream = client.table(testTable.TableName).createDownloadStream();
    var uploadStream = client.table(testTable2.TableName).createUploadStream();

    var items = [];
    for (var i = 1; i < 101; i++) {
      items.push({id: "" + i, email: i + "@epha.com"});
    }

    return client.table(testTable.TableName).upload(items)
      .then(function () {
        return new Promise(function (resolve, reject) {
          downloadStream.pipe(uploadStream);

          uploadStream.on("finish", resolve);
          uploadStream.on("error", reject);
        });
      })
      .then(function () {
        return client.table(testTable2.TableName).download()
      })
      .then(function (res) {
        items.map(function (obj) {
          expect(res).to.contain(obj);
        });
      });
  });
});
