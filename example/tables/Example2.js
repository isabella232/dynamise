"use strict";

module.exports = { 
  AttributeDefinitions: [
    { AttributeName: "Id", AttributeType: "S" }
  ],
  KeySchema: [
    { AttributeName: "Id", KeyType: "HASH"}
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 11,
    WriteCapacityUnits: 10
  },
  TableName: "Example2"
};