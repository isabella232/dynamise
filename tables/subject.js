"use strict";

//person:id,role:id,domain:id 
module.exports = {
    TableName: "Subject",
    AttributeDefinitions: [
        { AttributeName: "typeId", AttributeType: "S" },
        { AttributeName: "roleTypeId", AttributeType: "S" },
        { AttributeName: "domain", AttributeType: "S" }
    ],
    // Alle meine Rollen
    KeySchema: [
        { AttributeName: "typeId", KeyType: "HASH" }
        { AttributeName: "roleTypeId", KeyType: "RANGE" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
        {// Alle Patienten in meiner Praxis
            IndexName: "DomainRoleTypeIdIndex",
            KeySchema: [
                { AttributeName: "domain", KeyType: "HASH" }
                { AttributeName: "roleTypeId", KeyType: "RANGE" } 
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