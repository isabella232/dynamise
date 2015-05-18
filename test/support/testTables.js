"use strict";

var test1 = {
  TableName: "test",
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
    { AttributeName: "email", AttributeType: "S" }
  ],
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 2,
    WriteCapacityUnits: 2
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: "idIndex",
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
      ],
      Projection: {
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      }
    },
    {
      IndexName: "emailIndex",
      KeySchema: [
        { AttributeName: "email", KeyType: "HASH" }
      ],
      Projection: {
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      }
    }
  ]
};

var test2 = {

};

module.exports = {
  test: test1,
  test2: test2
};