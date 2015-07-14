"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test2;

describe("client.update(params)", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
  });

  it("should update the Provisioned Throughput properly", function () {
    var params = {
      TableName: testTable.TableName,
      ProvisionedThroughput: {
        ReadCapacityUnits: 4,
        WriteCapacityUnits: 4
      }
    };

    return client.update(params)
      .then(function () {
        return client.read(testTable.TableName);
      })
      .then(function (res) {
        expect(res.ProvisionedThroughput).to.contain(params.ProvisionedThroughput);
      })
      .catch(function (err) {
        console.trace(err.stack);
      });
  });

  it("should add another Global Secondary Index with given parameters", function () {
    // At the moment there is an issue with updating GlobalSecondaryIndexes on dynalite
    // See: https://github.com/mhart/dynalite/issues/26

    //var indexToCreate = {
    //  IndexName: "emailIndex",
    //  KeySchema: [
    //    {AttributeName: "email", KeyType: "HASH"},
    //    {AttributeName: "id", KeyType: "RANGE"}
    //  ],
    //  Projection: {
    //    ProjectionType: "ALL"
    //  },
    //  ProvisionedThroughput: {
    //    ReadCapacityUnits: 4,
    //    WriteCapacityUnits: 4
    //  }
    //};
    //
    //var params = {
    //  TableName: testTable.TableName,
    //  AttributeDefinitions: [
    //    {AttributeName: "id", AttributeType: "S"},
    //    {AttributeName: "email", AttributeType: "S"}
    //  ],
    //  GlobalSecondaryIndexUpdates: [
    //    {Create: indexToCreate}
    //  ]
    //};
    //
    //return client.update(params)
    //  .then(function () {
    //    return client.read(testTable.TableName);
    //  })
    //  .then(function (res) {
    //    expect(res.GlobalSecondaryIndexes[0]).to.include.keys(indexToCreate);
    //    expect(res.GlobalSecondaryIndexes[0].ProvisionedThroughput).to.contain(indexToCreate.ProvisionedThroughput);
    //    expect(res.GlobalSecondaryIndexes[0].KeySchema).to.eql(indexToCreate.KeySchema);
    //  })
    //  .catch(function (err) {
    //    console.trace(err.code, err.stack);
    //  });
  });

  it("should throw an error if parameters are invalid", function () {
    var params = {
      TableName: testTable.TableName,
      ProvisionedThroughpat: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    return client.update(params)
      .catch(function (err) {
        expect(err).to.be.instanceof(Error);
        expect(err.code).to.equal("UnexpectedParameter");
      });
  });

});