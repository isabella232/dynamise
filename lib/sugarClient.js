"use strict";

var stream = require("stream");

var dynamoClient = require("./dynamoClient");
var sugar = require("./sugar");

function sugarClient(client) {

  return {
    //---
    // Specific Table Definitions
    // @definitions (object) { tableName:tableSchema }
    set: function (definitions) {
      return sugar.table.set(client, definitions);
    },
    get: function (definition) {
      return sugar.table.get(client, definition);
    },
    listTables: function (params) {
      return sugar.table.listTables(client, params);
    },
    create: function (tableName) {
      return sugar.table.create(client, tableName);
    },
    read: function (tableName) {
      return sugar.table.read(client, tableName);
    },
    remove: function (tableName) {
      return sugar.table.remove(client, tableName);
    },
    status: function (tableName) {
      return sugar.table.status(client, tableName);
    },
    active: function (tableName) {
      return sugar.table.active(client, tableName);
    },
    recreate: function (tableName) {
      return sugar.table.recreate(client, tableName);
    },

    multiUpsert: function (tables) {
      return sugar.item.multi.upsert(client, tables);
    },

    multiRead: function (params) {
      return sugar.item.multi.read(client, params);
    },

    dynamo: dynamoClient(client),

    table: function table(tableName) {
      return {

        create: function (item) {
          return sugar.item.create(client, tableName, item);
        },

        read: function (hash, range) {
          return sugar.item.read(client, tableName, hash, range);
        },

        patch: function (item) {
          return sugar.item.patch(client, tableName, item);
        },

        upsert: function (item) {
          return sugar.item.upsert(client, tableName, item);
        },

        multiUpsert: function (items) {
          var tables = {};
          tables[tableName] = items;

          return sugar.item.multi.upsert(client, tables);
        },

        upload: function (input) {
          return this.multiUpsert(input);
        },

        createUploadStream: function () {
          return new sugar.streams.UploadStream(client, table(tableName).multiUpsert);
        },

        download: function (params) {
          return this.scanAll(params);
        },

        createDownloadStream: function () {
          return new sugar.streams.DownloadStream(client, table(tableName).scanAll);
        },

        remove: function (hash, range) {
          return sugar.item.remove(client, tableName, hash, range);
        },

        find: function (params) {
          return sugar.item.find(client, tableName, params);
        },

        findAll: function (params) {
          return sugar.item.findAll(client, tableName, params);
        },

        query: function (params) {
          return sugar.item.query(client, tableName, params);
        },

        scan: function (params) {
          return sugar.item.scan(client, tableName, params);
        },

        scanAll: function (params) {
          return sugar.item.scanAll(client, tableName, params);
        }

      };
    }
  };
}

module.exports = sugarClient;