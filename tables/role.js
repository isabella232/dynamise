"use strict";

module.exports = {
    version: 1,
    TableName: "role",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }/*,
        { AttributeName: "name", AttributeType: "S" }*/
    ],
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};