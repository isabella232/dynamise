"use strict";

module.exports = {
    TableName: "test",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" }
    ],
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
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
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
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
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
    ]
};