"use strict";

var expect = require("chai").expect;

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
      .delete("test")
      //we don't care if it did not exist
      .catch(function () {
        return true;
      })
      .then(function () {
        return client.create("test");
      })
    .then(function(res) {
        return client.active("test");
      })
    .then(function(res) {
        console.log(res);
      });
  });

  describe("UploadStream", function () {

    it("should work!", function (done) {

      var data = [
        {
          id: "1",
          email: "mj@peerigon.com"
        },
        {
          id: "2",
          email: "md@peerigon.com"
        }
      ];

      var upload = client.table("test").upload();

      upload.on("finish", done);

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

});