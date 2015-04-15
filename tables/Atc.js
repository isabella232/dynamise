"use strict";

module.exports = { 
  AttributeDefinitions: [ 
    { AttributeName:"Code", AttributeType:"S"}, 
    { AttributeName:"Name", AttributeType:"S"}
  ],
  KeySchema: [ { AttributeName: 'Code', KeyType: 'HASH'}],
  ProvisionedThroughput: { ReadCapacityUnits: 8, WriteCapacityUnits: 8 },
  TableName: 'Atc', // required 
  GlobalSecondaryIndexes: 
  [
    {
      IndexName: 'NameIndex',
      KeySchema: [ { AttributeName: 'Name', KeyType: 'HASH'}],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: { ReadCapacityUnits: 8, WriteCapacityUnits: 8 }
    }
  ]
};