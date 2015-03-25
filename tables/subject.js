"use strict";

module.exports = {
    version: 1,
    TableName: "subject",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }/*,
        { AttributeName: "domain", AttributeType: "S" },
        { AttributeName: "user", AttributeType: "S" },
        { AttributeName: "role", AttributeType: "S" },
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
            IndexName: "subjectIdIndex",
            KeySchema: [
                { AttributeName: "id", KeyType: "HASH" } // Domain#User#Role
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
        // we have to add additional Indexes
        // each users of a domain
        // each patients of a domain
        // each doctors of a domain
        // each doctor of a domain
        // each domains of an user
        // ...
    ]
};