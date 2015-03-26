"use strict";

var when = require("when"),
    DynamoDB = require("dynamo"),
    metaTableDefinition = require("./metaTable");

function syncMetaTable() {

    var self = this;

    return this.hasTable("meta")
        //should be changed in lib
        .catch(function () {
            return self.createTable(metaTableDefinition);
        })
        .then(function () {
            //fetch all table entries
            return self.scan({
                TableName: "meta"
            })
        })
        .then(function (res) {
            return res.Items;
        })
}

function createTables(tables) {

    var self = this;
    var definitions = [];

    Object.keys(tables).forEach(function (key) {
        definitions.push(tables[key]);
    });

    return when.map(definitions, function (tableDefinition) {
        return self.createTable(tableDefinition);
    });
}

function syncTable(meta, table, tableName) {

    var self = this,
        version = table.version;

    //TODO make copy here
    delete table.version; //version key is not allowed in dynamo

    //table does not exist yet
    if (!meta) {
        console.log("Table '" + tableName + "' does not exist yet. Creating...");

        return this.createTable(table)
            .then(function () {

                var metaItem = {
                    table: table.TableName,
                    version: version,
                    created: new Date().getTime(),
                    lastUpdate: new Date().getTime()
                };

                return self.putItem({
                    TableName: "meta",
                    Item: metaItem
                })
                    .then(function (res) {
                        return res.Item;
                    })
            });
    }

    if (meta.version === version) {
        console.log("Table '" + tableName + "' already up to date");
        return meta;
    }

    if(meta.version < version) {
        console.warn("Table '" + tableName + "' is outdated. Update manually.");

        /*
        return self.updateTable(table)
            .then(function() {
                return self.updateItem({
                    TableName: "meta",
                    Key: {
                        table: table.TableName
                    },
                    AttributeUpdates: {
                        version: {
                            Action: "PUT",
                            Value: version
                        },
                        lastUpdated: {
                            Action: "PUT",
                            Value: new Date().getTime()
                        }
                    }
                })
            })
            .then(function(res) {
                return res.Item;
            })
            */
    }
}

function syncTables(tables, callback) {
    var self = this;

    /*
    this.deleteAllTables()
        .then(function () {
            return self.syncMetaTable();
        })
        //*/
         self.syncMetaTable()
        .then(function (metaTable) {

            console.log("Syncing Tables: " + Object.keys(tables).join(","));

            return when.map(Object.keys(tables), function (tableName) {

                //find meta data
                var meta = metaTable.filter(function (elem) {
                    return elem.table === tableName;
                });

                return self.syncTable(meta[0], tables[tableName], tableName);
            });
        })
        .done(function() {
            callback();
        }, callback);
}

function useSchemas(schemas) {
    //dbClient.useSchemas(schemas):
}

module.exports = function connect(config) {

    var client;

    if (typeof config === "string") {
        config = {
            endpoint: config
        }
    }

    client = new DynamoDB(config);

    client.syncMetaTable = syncMetaTable;

    //or maybe wrap directly in dynamo lib
    client.useSchemas = useSchemas;
    client.syncTables = syncTables;
    client.createTables = createTables;
    client.syncTable = syncTable;

    return client;
};