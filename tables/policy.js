"use strict";

module.exports = {
    version: 1,
    TableName: "policy",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "resourceType", AttributeType: "S" },
        { AttributeName: "method", AttributeType: "S" }/*, // GET, POST, PUT, DELETE
        { AttributeName: "rules", AttributeType: "LS" },*/
    ],
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" } // resourceType#method
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: "policyResourceTypeMethodIndex",
            KeySchema: [
                { AttributeName: "resourceType", KeyType: "HASH" },
                { AttributeName: "method", KeyType: "RANGE" }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
    ]
};