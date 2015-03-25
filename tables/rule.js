"use strict";

module.exports = {
    version: 1,
    TableName: "rule",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }/*,
        { AttributeName: "name", AttributeType: "S" },
        { AttributeName: "options", AttributeType: "B" }*/
    ],
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};