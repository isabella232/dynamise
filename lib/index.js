"use strict";

var DynamoDB = require("aws-sdk").DynamoDB,
    transform = require("./transform");

var connections,
    tables,
    schemas,
    clients = {};

function tableSugar(client, tableName) {
    return {
        /**
         * Creates a new item
         *
         * Rejects if an item already exists in the
         * specified table with the same primary key
         *
         * var params = {
         *    TableName:"",
         *    Item:{},
         *
         *    Expected: {
         *      Exists: (true|false),
         *      Value: { type: value },
         *    },
         *    ReturnConsumedCapacity: ('INDEXES | TOTAL | NONE'),
         *    ReturnItemCollectionMetrics: ('SIZE | NONE')
         *    ReturnValues: ('NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW')
         *  }
         *
         * returns data = {
         *     Attributes:{}
         *   }
         *
         * @param item
         * @returns {Promise}
         */
        create: function createItem(item) {

            //TODO To prevent a new item from replacing an existing item, use a conditional
            //put operation with ComparisonOperator set to NULL for the primary key attribute, or attributes.
            //http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html

            return new Promise(function (resolve, reject) {
                var params = {
                    TableName: tableName,
                    Item: transform.to(item)
                };

                client.putItem(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res);
                });
            });
        },
        read: function readItem(key) {

            return new Promise(function (resolve, reject) {
                var params = {
                    TableName: tableName,
                    Key: transform.to(key)
                };

                client.getItem(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (res.Item) {
                        res.Item = transform.from(res.Item);
                    }

                    resolve(res.Item);
                });
            });
        },
        query: function queryItem() {

        },
        scan: function scanItem() {

        },
        /**
         * patches only existing Items
         * @returns {Promise}
         */
        patch: function patchItem(item) {

            //TODO tweak params to not create but only patch!

            return new Promise(function (resolve, reject) {
                var params = {
                    TableName: tableName,
                    Item: transform.to(item)
                };

                client.updateItem(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res);
                });
            });
        },
        /**
         * Replaces or creates an Item
         * @param {Object} item
         * @returns {Promise}
         */
        upsert: function upsertItem(item) {

            return new Promise(function (resolve, reject) {
                var params = {
                    TableName: tableName,
                    Item: transform.to(item)
                };

                client.putItem(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res);
                });
            });
        },
        /**
         * deletes an Item
         * @param {Object} key
         * @returns {Promise}
         */
        delete: function deleteItem(key) {

            return new Promise(function (resolve, reject) {

                var params = {
                    TableName: tableName,
                    Key: transform.to(key)
                };

                client.deleteItem(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(res);
                });
            });
        },
        multiPatch: function multiPatchItems() {

        },
        multiUpsert: function multiUpsertItems() {

        }
    };
}

function sugar(client) {

    return {
        create: function createTable(tableDefinition) {

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
        read: function readTable(tableName) {

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
        delete: function deleteTable(tableName) {

            return new Promise(function (resolve, reject) {

                var params = {
                    TableName: tableName
                };

                client.deleteTable(params, function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve();
                });
            });
        },
        status: function statusOfTable(tableName) {

            //TODO reuse same function as above calling this.read (needs a class)
            return new Promise(function (resolve, reject) {

                var params = {
                        TableName: tableName
                    },
                    tableDb;

                client.describeTable(params, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    tableDb = res.Table;

                    resolve({
                        TableSizeBytes: tableDb.TableSizeBytes,
                        TableStatus: tableDb.TableStatus,
                        ItemCount: tableDb.ItemCount,
                        //TODO maybe find a better name than "outdated"
                        outdated: JSON.stringify(tableDb) == JSON.stringify(tables[tableName])
                    });
                });
            });
        },
        upgrade: function upgradeTable(tableName) {

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

                .then(function () {
                    //TODO calculate diff and build updateTable params
                    throw new Error("Not implemented yet.");
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