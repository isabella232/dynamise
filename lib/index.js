"use strict";

var when = require("when"),
    DynamoDB = require("dynamo"),
    metaTableDefintion = require("./metaTable");

function syncMetaTable() {

    var self = this;

    return this.hasTable("meta")
        //should be changed in lib
        .catch(function () {
            return self.createTable(metaTableDefintion);
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

function syncTables(tables, callback) {
    var self = this;

    this.deleteAllTables()
        .then(function () {
            return self.syncMetaTable();
        })
        .then(function (metaTable) {

            console.log("Syncing Tables: " + Object.keys(tables).join(","));

            return when.map(Object.keys(tables), function (tableName) {

                //find meta data
                var meta = metaTable.filter(function (elem) {
                    return elem.table === tableName;
                });

                return when.promise(function () {

                    //create meta table
                    if (meta.length === 1) {
                        return meta[0];
                    }

                    var item = {
                        table: tableName,
                        version: tables[tableName].version,
                        created: new Date().getTime(),
                        lastUpdate: new Date().getTime()
                    };

                        console.log("Meta table for " + tableName + " does not exist. Inserting ", item);

                        return self.putItem({
                            TableName: "meta",
                            Item: item
                        })
                            .then(function() {
                                return item;
                            })
                })
                    .then(function (meta) {

                        console.log("Meta meta mte a", meta);

                        //same version! easy!
                        if(meta.version === tables[tableName].version) {
                            console.log("Table " + tableName + " is already up to date");
                            return;
                        }

                        //new version detected
                        if(meta.version < tables[tableName].version) {
                            console.log("Table " + tableName + " is outdated and must be updated to version " + tables[tableName].version);
                            return self.updateTable(tables[tableName])
                                .then(function() {
                                    //update meta entry
                                    //self.updateItem();
                                })
                        }
                    })
            });
           // return self.createTables(tables);
        })
        .done(callback, callback);
    //save table versions
    //create or update table
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

    return client;
};