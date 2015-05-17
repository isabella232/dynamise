"use strict";

var stream = require("stream");

var dynamoClient = require("./dynamoClient");
var sugar = require("./sugar");

var buildKey = require("./sugar/utils").buildKey;

function sugarClient(client) {

  return {

    /**
     *
     * @param {Object} definitions
     * @returns {Promise}
     */
    set: function (definitions) {
      return sugar.table.set(client, definitions);
    },

    /**
     *
     * @param {Object} definition
     * @returns {Promise}
     */
    get: function (definition) {
      return sugar.table.get(client, definition);
    },

    /**
     * You will get an array with all the table names associated with the endpoint.
     *
     * See [DynamoDB.listTables](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html) for more information.
     *
     * @param {Object} params
     * @returns {Promise}
     */
    listTables: function (params) {
      return sugar.table.listTables(client, params);
    },

    /**
     * Adds a new table if it does exist in `/tables`. Otherwise you are able to hand over a complete table object.
     *
     * See [DynamoDB.createTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html) for more information.
     *
     * @param {String} tableName
     * @returns {Promise}
     */
    create: function (tableName) {
      return sugar.table.create(client, tableName);
    },

    /**
     * You will get certain information about the table specified.
     *
     * See [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html) for more information.
     *
     * > Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.
     *
     * @param {String} tableName
     * @returns {Promise}
     */
    read: function (tableName) {
      return sugar.table.read(client, tableName);
    },

    /**
     * Deletes the table and all of its items.
     *
     * See [DynamoDB.deleteTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteTable.html) for mor information.
     *
     * @param {String} tableName
     * @returns {Promise}
     */
    remove: function (tableName) {
      return sugar.table.remove(client, tableName);
    },

    /**
     * This function uses `client.read(tableName)` but only fetches the following information:
     *
     * - TableSizeBytes (total size in bytes)
     * - TableStatus (CREATING, DELETING, UPDATING, ACTIVE)
     * - ItemCount (number of items)
     *
     * and if the table is *upgradable* (true|false).
     *
     * @param {String} tableName
     * @returns {Promise}
     */
    status: function (tableName) {
      return sugar.table.status(client, tableName);
    },

    /**
     * Checks if the table state is `ACTIVE` and returns an object with table data. If the table is not active it waits for the table to become active.
     *
     * Uses `client.read(tableName)` and therefore [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html).
     *
     * @param {String} tableName
     * @returns {Promise}
     */
    active: function (tableName) {
      return sugar.table.active(client, tableName);
    },

    /**
     * Recreates the table if exists or creates the table if not and waits until active.
     *
     * @param {String} tableName
     * @returns {Promise}
     */
    recreate: function (tableName) {
      return sugar.table.recreate(client, tableName);
    },

    /**
     * Does an multiUpsert on the tables specified in the tables object.
     *
     * See [DynamoDB.batchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for more information.
     *
     * @param {Object} tables
     * @returns {Promise}
     */
    multiUpsert: function (tables) {
      return sugar.item.multi.upsert(client, tables);
    },

    /**
     * See [DynamoDB.batchGetItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) for more information.
     *
     * @param {Object} params
     * @returns {Promise}
     */
    multiRead: function (params) {
      return sugar.item.multi.read(client, params);
    },

    dynamo: dynamoClient(client),

    table: function table(tableName) {
      return {

        /**
         * Creates an item at the specified table.
         *
         * **NOTE:** You are not able to replace an item. It is only created if the item does not exist yet.
         *
         * @param {Object}item
         * @returns {Promise}
         */
        create: function (item) {
          return sugar.item.create(client, tableName, item);
        },

        /**
         * See [DynamoDB.getItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html).
         *
         * @param {String} hash
         * @param {String} range
         * @returns {Promise}
         */
        read: function (hash, range) {
          return sugar.item.read(client, tableName, hash, range);
        },

        /**
         * Use to update an existing item.
         *
         * See [DynamoDB.updateItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) for more information.
         *
         * @param {Object} item
         * @returns {Promise}
         */
        patch: function (item) {
          return sugar.item.patch(client, tableName, item);
        },

        /**
         * See [DynamoDB.putItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) for more information.
         *
         * @param {Object} item
         * @returns {Promise}
         */
        upsert: function (item) {
          return sugar.item.upsert(client, tableName, item);
        },

        /**
         * See [DynamoDB.batchGetItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) for more information.
         *
         * @param {Array} items
         * @returns {Promise}
         */
        multiRead: function (items) {
          var params = {
            RequestItems: {}
          };

          params.RequestItems[tableName] = {};
          params.RequestItems[tableName].Keys = items.map(function (item) {
            return buildKey(client, tableName, item);
          });

          return sugar.item.multi.read(client, params);
        },

        /**
         * Uses the *batchWriteItem* method from AWS.DynamoDB to do an upsert on many items. Note that *batchWriteItem* cannot update items. Items which already exist are fully replaced.
         *
         * **NOTE:** If you want to multiUpsert on different tables use the client.multiUpsert() method. Actually, this method is using it either.
         *
         * See [DynamoDB.batchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for more information.
         *
         * @param {Array} items
         * @returns {Promise}
         */
        multiUpsert: function (items) {
          var tables = {};
          tables[tableName] = items;

          return sugar.item.multi.upsert(client, tables);
        },

        /**
         * Upload an array of items using multiUpsert. Returns a Promise which handles the events internally.
         *
         * **NOTE:** Currently this is only an alias for client.table("tableName").multiUpsert()
         *
         * @param {Array} input
         * @returns {Promise}
         */
        upload: function (input) {
          return this.multiUpsert(input);
        },

        /**
         * Returns an instance of `UploadStream` to handle an upload via stream manually.
         *
         * @returns {UploadStream}
         */
        createUploadStream: function () {
          return new sugar.streams.UploadStream(client, table(tableName).multiUpsert);
        },

        /**
         * Actually this is an alias for `clieb.table(tableName).scanAll()` - does a complete scan.
         *
         * @param {Object} params
         * @returns {Promise}
         */
        download: function (params) {
          return this.scanAll(params);
        },

        /**
         * Returns an instance of `DownloadStream` to handle a download manually.
         *
         * @returns {DownloadStream}
         */
        createDownloadStream: function () {
          return new sugar.streams.DownloadStream(client, table(tableName).scanAll);
        },

        /**
         * Deletes a single item in a table.
         *
         * See [DynamoDB.deleteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) for more information.
         *
         * @param {String} hash - The hash key of the table
         * @param {String} range - The range key of the table
         * @returns {Promise}
         */
        remove: function (hash, range) {
          return sugar.item.remove(client, tableName, hash, range);
        },

        /**
         *
         * @param {Object} params
         * @returns {Promise}
         */
        find: function (params) {
          return new sugar.item.find(client, tableName, params);
        },

        /**
         * See [DynamoDB.query](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) for more information.
         *
         * @param {Object} params
         * @returns {Promise}
         */
        query: function (params) {
          return sugar.item.query(client, tableName, params);
        },

        /**
         * Returns items of a table.
         *
         * > If the total number of scanned items exceeds the maximum data set size limit of 1 MB, the scan stops and results are returned to the user as a LastEvaluatedKey value to continue the scan in a subsequent operation.
         *
         * See [DynamoDB.scan](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) for more information.
         *
         * @param {Object} params
         * @returns {Promise}
         */
        scan: function (params) {
          return sugar.item.scan(client, tableName, params);
        },

        /**
         * Uses `client.table("tableName").scan()` to scan all items of a table.
         *
         * @param {Object} params
         * @returns {Promise}
         */
        scanAll: function (params) {
          return sugar.item.scanAll(client, tableName, params);
        }

      };
    }
  };
}

module.exports = sugarClient;