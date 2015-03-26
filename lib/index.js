"use strict";

var DynamoDB = require("aws-sdk").DynamoDB,
    diff = require("diff");

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
        query: function () {

        },
        scan: function () {

        },
        patch: function () {

        },
        upsert: function () {

        },
        delete: function () {

        },
        multiPatch: function () {

        },
        multiUpsert: function () {

        }
    };
}

function sugar(client) {

    return {
        create: function tableCreate(tableDefinition) {

            if (typeof tableDefinition === "string") {
                tableDefinition = tables[tableDefinition];
            }

            return new Promise(function (resolve, reject) {

                client.createTable(tableDefinition, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res);
                });
            });
        },
        read: function tableRead(tableName) {

            return new Promise(function (resolve, reject) {

                var params = {
                    TableName: tableName
                };

                client.describeTable(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res.Table);
                });
            });
        },
        status: function tableStatus(tableName) {

            //TODO reuse same function as above calling this.read (needs a class)
            return new Promise(function (resolve, reject) {

                var params = {
                    TableName: tableName
                };

                client.describeTable(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res.Table);
                });
            })
                .then(function (tableDb) {

                    return {
                        TableSizeBytes: tableDb.TableSizeBytes,
                        TableStatus: tableDb.TableStatus,
                        ItemCount: tableDb.ItemCount,
                        //TODO maybe find a better name than "outdated"
                        outdated: JSON.stringify(tableDb) == JSON.stringify(tables[tableName])
                    }
                });
        },
        upgrade: function tableUpgrade(tableName) {

            //TODO reuse same function as above calling this.read (needs a class)
            return new Promise(function (resolve, reject) {

                var params = {
                    TableName: tableName
                };

                client.describeTable(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res.Table);
                });
            })

                .then(function (tableDb) {
                    //TODO get diff and calculate updateTable call!
                });


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