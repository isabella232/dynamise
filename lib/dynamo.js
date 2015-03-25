"use strict";

var dynamo = require("aws-sdk").DynamoDB;

//TODO add retry logic for batchWriteItem

module.exports = dynamo;