"use strict";

module.exports = {
    TableName: "user",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" },
        { AttributeName: "password", AttributeType: "S" }/*,
        { AttributeName: "createDate", AttributeType: "N" },
        { AttributeName: "firstname", AttributeType: "S" },
        { AttributeName: "lastname", AttributeType: "S" },
        { AttributeName: "locked", AttributeType: "B" }*/
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
            IndexName: "userIdIndex",
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
            IndexName: "userEmailIndex",
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
        },
        {
            IndexName: "userEmailPasswordIndex",
            KeySchema: [
                { AttributeName: "email", KeyType: "HASH" },
                { AttributeName: "password", KeyType: "RANGE" }
            ],
            Projection: {
                ProjectionType: "INCLUDE",
                NonKeyAttributes: ["password"]
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
    ]
};