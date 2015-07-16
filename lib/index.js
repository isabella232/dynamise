"use strict";


//fixes undefined datatypes bug of dynamodb-doc
require("./monkeyPatch");

var DynamoDB = require("aws-sdk").DynamoDB;
var DOC = require("dynamodb-doc");

var sugarClient = require("./sugarClient");

var endpoints = require("./endpoints");

// Endpoints
var clients = {};

module.exports = function (endpoint) {

  if(!clients[endpoint]) {
    clients[endpoint] = {
      endpoint: new DOC.DynamoDB(new DynamoDB(endpoints[endpoint])),
      tables: {}
    };
  }

  return sugarClient(clients[endpoint]);
};
