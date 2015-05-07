"use strict";

var dynamo = require("./dynamo");

function dynamoClient(client) {

  return {

    batchGetItem: function (params) {
      return dynamo.batchGetItem(client, params);
    },

    batchWriteItem: function (params) {
      return dynamo.batchWriteItem(client, params);
    },

    createTable: function (params) {
      return dynamo.createTable(client, params);
    },

    deleteItem: function (params) {
      return dynamo.deleteItem(client, params);
    },

    deleteTable: function (params) {
      return dynamo.deleteTable(client, params);
    },

    describeTable: function (params) {
      return dynamo.describeTable(client, params);
    },

    getItem: function (params) {
      return dynamo.getItem(client, params);
    },

    listTables: function (params) {
      return dynamo.listTables(client, params);
    },

    putItem: function(params) {
      return dynamo.putItem(client, params);
    },

    query: function (params) {
      return dynamo.query(client, params);
    },

    scan: function (params) {
      return dynamo.scan(client, params);
    },

    updateItem: function (params) {
      return dynamo.updateItem(client, params);
    },

    updateTable: function (params) {
      // TODO: not implemented in promise yet
      return true;
    }
  }
}

module.exports = dynamoClient;