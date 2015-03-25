"use strict";

module.exports = {
    TableName: "domain",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }/*,
        { AttributeName: "name", AttributeType: "S" },
        { AttributeName: "createDate", AttributeType: "N" },
        { AttributeName: "locked", AttributeType: "B" },
        { AttributeName: "subDomains", AttributeType: "SS" }*/
    ],
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};