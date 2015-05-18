"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTable");
var expectTableNonExistingError = require("../../../support/helpers").expectTableNonExistingError;

describe("client.status(table)", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.remove(testTable)
      //we don't care if it did not exist
      .catch(function () {
        return true;
      });
  });

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
  it("should return 'upgradable = false' if the local table definition and table description are equal", function () {

    return client.recreate(testTable)
      .then(function () {
        return client.status(testTable);
      })
      .then(function (status) {
        expect(status.Upgradable).to.eql(false);
      });
  });

  it("should return 'upgradable = true' if the local table definition and table description differ", function () {

    client.set({
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

    return client.recreate(testTable)
      .then(function () {
        return client.status("test");
      })
      .then(function (status) {
        expect(status.Upgradable).to.eql(true);
      });
  });
});
