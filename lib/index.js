"use strict";

var DynamoDB = require("aws-sdk").DynamoDB;
var sugar = require("./sugar");

var endpoints = require("./endpoints");

// Specification
var tables = require("../tables") || {};

// Endpoints
var clients = {};

module.exports = function (endpoint) {

  if(!clients[endpoint]) {
    clients[endpoint] = {
      endpoint: new DynamoDB(endpoints[endpoint]),
      tables: tables //TODO remove tables here.. should only happen via SET
    };
  }

  return sugar(clients[endpoint]);
};
