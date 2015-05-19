"use strict";

var DynamoDB = require("aws-sdk").DynamoDB;
var sugarClient = require("./sugarClient");

var endpoints = require("./endpoints");

// Specification
var tables = require("../tables") || {};

// Endpoints
var clients = {};

module.exports = function (endpoint) {

  if(!clients[endpoint]) {
    clients[endpoint] = {
      endpoint: new DynamoDB(endpoints[endpoint]),
      tables: {}
    };
  }

  return sugarClient(clients[endpoint]);
};
