"use strict";

var DynamoDB = require("aws-sdk").DynamoDB;
var sugar = require("./sugar");

// Keep Endpoints
var clients = {};

// Get Endpoint
module.exports = function(endpoint) {
  
  var endpoints = {
    "local": { 
      "endpoint": "http://localhost:8000"
    },
    "us-east-1": { // North Virigina
      "endpoint": "https://dynamodb.us-east-1.amazonaws.com"
    },
    "us-west-1": { // North California
      "endpoint": "https://dynamodb.us-west-1.amazonaws.com"
    },
    "us-west-2": { //Oregon
      "endpoint": "https://dynamodb.us-west-2.amazonaws.com"
    },
    "eu-west-1": { //Ireland
      "endpoint": "https://dynamodb.eu-west-1.amazonaws.com"
    },
    "eu-central-1": { //Germany
      "endpoint": "https://dynamodb.eu-central-1.amazonaws.com"
    },
    "ap-southeast-1": { //Singapore
      "endpoint": "https://dynamodb.ap-southeast-1.amazonaws.com"
    },
    "ap-southeast-2": { //Syndey
      "endpoint": "https://dynamodb.ap-southeast-2.amazonaws.com"
    },
    "ap-northeast-1": { //Tokyo
      "endpoint": "https://dynamodb.ap-northeast-1.amazonaws.com"
    }, 
    "sa-east-1": { //Sao Paulo
      "endpoint": "https://dynamodb.sa-east-1.amazonaws.com"
    }
  };

  if(!clients[endpoint]) {
    clients[endpoint] = {
      endpoint: new DynamoDB(endpoints[endpoint]),
      tables: {},
      schemas: {}
    }
  }

  return sugar( clients[endpoint] );
}
