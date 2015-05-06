"use strict";

var promise = require("./promise");

function dynamo(client) {

  return {

    batchGetItem: function (params) {
      return promise.batchGetItem(client, params);
    },

    batchWriteItem: function (params) {
      return promise.batchWriteItem(client, params);
    },

    createTable: function (params) {
      return promise.createTable(client, params);
    },

    deleteItem: function (params) {
      return promise.deleteItem(client, params);
    },

    deleteTable: function (params) {
      return promise.deleteTable(client, params);
    },

    describeTable: function (params) {
      return promise.describeTable(client, params);
    },

    getItem: function (params) {
      return promise.getItem(client, params);
    },

    listTables: function (params) {
      return promise.listTables(client, params);
    },

    putItem: function(params) {
      return promise.putItem(client, params);
    },

    query: function (params) {
      return promise.query(client, params);
    },

    scan: function (params) {
      return promise.scan(client, params);
    },

    updateItem: function (params) {
      return promise.updateItem(client, params);
    },

    updateTable: function (params) {
      // TODO: not implemented in promise yet
      return true;
    }
  }
}

module.exports = dynamo;