"use strict";

module.exports = {
    TableName: "meta",
    AttributeDefinitions: [
        {AttributeName: "table", AttributeType: "S"}
        // {AttributeName: "version", AttributeType: "N"},
        // {AttributeName: "lastUpdated", AttributeType: "S"},
        // {AttributeName: "created", AttributeType: "S"}
    ],
    KeySchema: [
        {AttributeName: "table", KeyType: "HASH"} // resourceType#method
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};