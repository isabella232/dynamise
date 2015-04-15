"use strict";
// id
// name

module.exports = { 
  AttributeDefinitions: [ 
    { AttributeName:"id", AttributeType:"S"}
  ],
  KeySchema: [ { AttributeName: 'id', KeyType: 'HASH'}],
  ProvisionedThroughput: { ReadCapacityUnits: 8, WriteCapacityUnits: 8 },
  TableName: 'Domain' // required 
};