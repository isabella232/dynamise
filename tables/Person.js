"use strict";
// id
// name
// email
// sha(pwd+salt)
// require("crypto").bcrypt

module.exports = { 
  AttributeDefinitions: [ 
    { AttributeName:"id", AttributeType:"S"}, 
    { AttributeName:"email", AttributeType:"S"}
  ],
  KeySchema: [ { AttributeName: 'id', KeyType: 'HASH'}],
  ProvisionedThroughput: { ReadCapacityUnits: 8, WriteCapacityUnits: 8 },
  TableName: 'Person', // required 
  GlobalSecondaryIndexes: 
  [
    {
      IndexName: 'EmailIndex',
      KeySchema: [ { AttributeName: 'email', KeyType: 'HASH'}],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: { ReadCapacityUnits: 8, WriteCapacityUnits: 8 }
    }
  ]
};