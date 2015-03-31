"use strict";

module.exports = {
  AttributeDefinitions: [
    { AttributeName: "Pmid", AttributeType: "S" }
  ],
  KeySchema: [ // required
    { AttributeName: 'Pmid', KeyType: 'HASH'}
  ],
  ProvisionedThroughput: { // required
    ReadCapacityUnits: 8, // required
    WriteCapacityUnits: 8 // required
  },
  TableName: 'Pubmed' // required 
};