"use strict";

//person:id,role:id,domain:id 
module.exports = {
    TableName: "Subject",
    AttributeDefinitions: [
        { AttributeName: "person", AttributeType: "S" },
        { AttributeName: "role", AttributeType: "S" },
        { AttributeName: "domain", AttributeType: "S" }
    ],
    // Alle meine Rollen
    KeySchema: [
        { AttributeName: "person", KeyType: "HASH" }
        { AttributeName: "role", KeyType: "RANGE" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
        {// Alle Patienten in meiner Praxis
            IndexName: "DomainRoleIndex",
            KeySchema: [
                { AttributeName: "domain", KeyType: "HASH" } // Domain#User#Role
                { AttributeName: "role", KeyType: "RANGE" } // Domain#User#Role
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        },
        {// Alle meine Patienten in meiner Domaine
            IndexName: "RoleDomainIndex",
            KeySchema: [
                { AttributeName: "role", KeyType: "HASH" } // Domain#User#Role
                { AttributeName: "domain", KeyType: "RANGE" } // Domain#User#Role
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