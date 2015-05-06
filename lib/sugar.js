"use strict";

var stream = require("stream");

var _ = require('lodash');

var transform = require("./transform");
var promise = require("./promise");

// helper tools
var i = require("./utils").i;
var throttledParallel = require("./utils").throttledParallel;
var delay = require("./utils").delay;

var sugarFn = require("./sugar/index");

function sugar(client) {

  var sugarClient = {
    //---
    // Specific Table Definitions
    // @definitions (object) { tableName:tableSchema }
    set: function (definitions) {
      return sugarFn.table.set(client, definitions);
    },
    get: function (definition) {
      return sugarFn.table.get(client, definition);
    },
    listTables: function (params) {
      return sugarFn.table.listTables(client, params);
    },
    create: function (tableName) {
      return sugarFn.table.create(client, tableName);
    },
    read: function (tableName) {
      return sugarFn.table.read(client, tableName);
    },
    remove: function (tableName) {
      return sugarFn.table.remove(client, tableName);
    },
    status: function (tableName) {
      return sugarFn.table.status(client, tableName);
    },
    active: function (tableName) {
      return sugarFn.table.active(client, tableName);
    },
    recreate: function (tableName) {
      return sugarFn.table.recreate(client, tableName);
    },

    multiUpsert: function (tables) {
      return sugarFn.item.multi.upsert(client, tables);
    },

    multiRead: function (params) {
      return sugarFn.item.multi.read(client, params);
    },

    table: function table(tableName) {
      return {

        create: function (item) {
          return sugarFn.item.create(client, tableName, item);
        },

        read: function (hash, range) {
          return sugarFn.item.read(client, tableName, hash, range);
        },

        patch: function (item) {
          return sugarFn.item.patch(client, tableName, item);
        },

        upsert: function (item) {
          return sugarFn.item.upsert(client, tableName, item);
        },

        multiUpsert: function (items) {
          var tables = {};
          tables[tableName] = items;

          return sugarFn.item.multi.upsert(client, tables);
        },

        upload: function (input) {
          return this.multiUpsert(input);
        },

        createUploadStream: function () {
          return new sugarFn.streams.UploadStream(client, table(tableName).multiUpsert);
        },

        download: function (params) {
          return this.scanAll(params);
        },

        createDownloadStream: function () {
          return new sugarFn.streams.DownloadStream(client, table(tableName).scanAll);
        },

        remove: function (hash, range) {
          return sugarFn.item.remove(client, tableName, hash, range);
        },

        find: function (params) {
          return sugarFn.item.find(client, tableName, params);
        },

        findAll: function (params) {
          return sugarFn.item.findAll(client, tableName, params);
        },

        query: function (params) {
          return sugarFn.item.query(client, tableName, params);
        },

        scan: function (params) {
          return sugarFn.item.scan(client, tableName, params);
        },

        scanAll: function (params) {
          return sugarFn.item.scanAll(client, tableName, params);
        }
      };
    }
  };

  return sugarClient;
}

module.exports = sugar;