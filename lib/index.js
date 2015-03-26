"use strict";

var DynamoDB = require("aws-sdk").DynamoDB;

var connections,
    tables,
    schemas,
    clients = {};

function tableSugar(client, tableName) {
    return {
        create: function modelCreate() {

        },
        read: function () {

        },
        query: function() {

        },
        scan: function() {

        },
        patch: function() {

        },
        upsert: function() {

        },
        delete: function() {

        },
        multiPatch: function() {

        },
        multiUpsert: function() {

        }
    };
}

function sugar(client) {

    return {
        create: function tableCreate() {

        },
        status: function tableStatus() {

        },
        upgrade: function tableUpgrade() {

        },
        table: function table(tableName) {
            return tableSugar(client, tableName);
        }

    }
}

function client(connectionId) {

    if (clients[connectionId]) {
        return sugar(clients[connectionId]);
    }

    clients[connectionId] = new DynamoDB(connections[connectionId]);

    return sugar(clients[connectionId]);
}

client.setConnections = function (con) {
    connections = con;
};

client.setTables = function (tab) {
    tables = tab;
};

client.setSchemas = function (sche) {
    schemas = sche;
};

module.exports = client;