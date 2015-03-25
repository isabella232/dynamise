"use strict";

module.exports = {
    version: 1,
    TableName: "resource",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "type", AttributeType: "S" },
        { AttributeName: "createDate", AttributeType: "N" },
        { AttributeName: "creator", AttributeType: "S" }, // Subject
        { AttributeName: "ownerDomain", AttributeType: "S" }
    ],
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" } // unique
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: "resourceTypeIndex",
            KeySchema: [
                { AttributeName: "type", KeyType: "HASH" }
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
            IndexName: "resourceCreatorCrateDateIndex",
            KeySchema: [
                { AttributeName: "creator", KeyType: "HASH" },
                { AttributeName: "createDate", KeyType: "RANGE" }
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
            IndexName: "resourceOwnerDomainIndex",
            KeySchema: [
                { AttributeName: "ownerDomain", KeyType: "HASH" },
                { AttributeName: "id", KeyType: "RANGE" }
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