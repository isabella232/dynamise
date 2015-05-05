"use strict";

var expect = require("chai").expect;

var db = require("../../lib/");
var testTable = require("../support/testTable");

function expectTableNonExistingError(err) {
  expect(err).to.be.instanceof(Error);
  expect(err.code).to.eql("ResourceNotFoundException");
}

function expectValidTableDescription(table, tableName) {
  expect(table).to.be.an("object");
  expect(table).to.contain.keys(["AttributeDefinitions", "CreationDateTime", "TableSizeBytes"]);
  expect(table.TableName).to.eql(tableName);
}

describe("Table", function () {

  var client;

  this.timeout(5000);

  before(function () {
    db("local").set({test: testTable});
  });

  beforeEach(function () {

    client = db("local");

    return client
      .remove(testTable)
      //we don't care if it did not exist
      .catch(function () {
        return true;
      });
  });

  describe("#remove", function () {

    describe("with a missing table", function () {

      it("should return a 'ResourceNotFoundException'", function () {

        return client.remove("NonExisting")
          .catch(function (err) {
            expectTableNonExistingError(err);
          });
      });
    });

    describe("with an existing table", function () {

      it("should delete the table and return table data", function () {

        return client
          .create(testTable)
          .then(function (data) {
            return client.remove(testTable);
          })
          .then(function (res) {
            expect(res).to.be.an("object");
            expect(res.TableDescription.TableName).to.eql("test");
          });
      });
    });
  });

  describe("#create", function () {

    it("should fail if table already exists", function () {

      return client
        .create(testTable)
        .then(function () {
          return client.create(testTable);
        })
        .catch(function (err) {
          expect(err).to.be.instanceOf(Error);
          expect(err.code).to.eql("ResourceInUseException");
        });
    });

    it("should create a table if passed a valid object", function () {

      return client
        .create(testTable)
        .then(function (res) {
          expectValidTableDescription(res.TableDescription, "test");
        });
    });

    it("should create a table if passed a table name and table has been registered before", function () {

      return client
        .create(testTable)
        .then(function (res) {
          expectValidTableDescription(res.TableDescription, "test");
        });
    });
  });


  describe("#status", function () {

    it("should fail if table does not exist", function () {

      return client
        .status(testTable)
        .catch(function (err) {
          expectTableNonExistingError(err);
        });
    });

    it("should return a subset of table description", function () {

      return client
        .create(testTable)
        .then(function () {
          return client.status(testTable);
        })
        .then(function (status) {
          expect(status).to.have.keys("TableSizeBytes", "TableStatus", "ItemCount", "Upgradable");
        });
    });


    //TODO not working with simple diff https://github.com/epha/model/issues/2
    it("should return upgradable = false if the local table definition and table description are equal", function () {

      return client
        .create(testTable)
        .then(function () {
          return client.status(testTable);
        })
        .then(function (status) {
          expect(status.Upgradable).to.eql(false);
        });
    });

    it("should return upgradable = true if the local table definition and table description differ", function () {

      db("local").set({
        test: {
          TableName: "test",
          AttributeDefinitions: [
            {AttributeName: "id", AttributeType: "S"}
          ],
          KeySchema: [
            {AttributeName: "id", KeyType: "HASH"}
          ],
          ProvisionedThroughput: {
            // ONLY THING changed
            ReadCapacityUnits: 12,
            WriteCapacityUnits: 10
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: "idIndex",
              KeySchema: [
                {AttributeName: "id", KeyType: "HASH"}
              ],
              Projection: {
                ProjectionType: "ALL"
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 20,
                WriteCapacityUnits: 30
              }
            }
          ]
        }
      });

      return client
        .create(testTable)
        .then(function () {
          return client.status("test");
        })
        .then(function (status) {
          expect(status.Upgradable).to.eql(true);
        });
    });
  });

  describe("#download", function () {

    var items = [];

    beforeEach(function () {

      for (var i = 0; i < 53; i++) {
        items.push({
          "id": "" + i,
          "email": i + "@epha.com"
        });
      }

      return client.create(testTable)
        .then(function () {
          return client.active(testTable.TableName);
        })
        .then(function () {
          return client.table(testTable.TableName).upload(items);
        })
    });

    it.only("should download all 53 items", function () {

      return client.table(testTable.TableName).download()
        .then(function (data) {
          expect(data).to.be.instanceof(Array);
          expect(data).to.have.length(53);
        });
    });

    afterEach(function () {
      return client.remove(testTable.TableName);
    })

  });

});
