"use strict";

module.exports = { 
  AttributeDefinitions: [
    { AttributeName: "Id", AttributeType: "S" }
  ],
  KeySchema: [ { AttributeName: 'Id', KeyType: 'HASH'}],
  ProvisionedThroughput: { ReadCapacityUnits: 8, WriteCapacityUnits: 10 },
  TableName: 'Matrix' // required 
};