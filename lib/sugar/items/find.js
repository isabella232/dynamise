"use strict";

var inspect = require("util").inspect;

var dynamo = require("../../dynamo");
var addCondition = require("../utils").addCondition;

function Find(client, tableName, params) {
  // prepare params object
  params = params || {};
  params.TableName = params.TableName || tableName;

  params.KeyConditions = params.KeyConditions || [];
  if(!Array.isArray(params.KeyConditions)) {
    throw new Error("KeyConditions have to be an array like in dynamodb-doc");
  }

  // assign necessary values
  this.params = params;
  this.client = client;
  this.evaluateLastKey = false;
}

Find.prototype.all = function() {
  this.evaluateLastKey = true;
  return this;
};

Find.prototype.index = function(indexName) {
  this.params.IndexName = indexName;
  return this;
};

Find.prototype.where = function(key) {
  var self = this;

  return {
    // on a hash key, only an equals condition is allowed!
    equals: function(value) {
      self.params.KeyConditions.push(self.client.endpoint.Condition(key, "EQ", value));
      return self;
    }
  };
};

Find.prototype.and = function(key) {
  var self = this;

  return {
    equals: function(value) {
      self.params.KeyConditions.push(self.client.endpoint.Condition(key, "EQ", value));
      return self;
    },
    beginsWith: function(value) {
      self.params.KeyConditions.push(self.client.endpoint.Condition(key, "BEGINS_WITH", value));
      return self;
    },
    lt: function(value) {
      self.params.KeyConditions.push(self.client.endpoint.Condition(key, "LT", value));
      return self;
    },
    le: function(value) {
      self.params.KeyConditions.push(self.client.endpoint.Condition(key, "LE", value));
      return self;
    },
    between: function (value1, value2) {
      self.params.KeyConditions.push(self.client.endpoint.Condition(key, "BETWEEN", value1, value2));
      return self;
    },
    gt: function (value) {
      self.params.KeyConditions.push(self.client.endpoint.Condition(key, "GT", value));
      return self;
    },
    ge: function (value) {
      self.params.KeyConditions.push(self.client.endpoint.Condition(key, "GE", value));
      return self;
    }
  };
};

Find.prototype.run = function() {
  // pagination?
  if (!this.evaluateLastKey) {
    return dynamo.query(this.client, this.params).then(function (res) {
      return res.Items;
    });
  }

  // pagination!
  var self = this;
  var responseItems = [];

  function queryWithEvaluation() {
    return dynamo.query(self.client, self.params)
      .then(function (res) {
        responseItems = responseItems.concat(res.Items);
        if (res.LastEvaluatedKey) {
          self.params.ExclusiveStartKey = res.LastEvaluatedKey;
          return queryWithEvaluation();
        } else {
          return res;
        }
      });
  }

  return queryWithEvaluation().then(function (res) {
    return responseItems;
  });
};

// used for debugging purposes - to be removed
Find.prototype.verbose = function() {
  console.log(inspect(this, {depth: null, colors: true}));
  return this;
};

module.exports = Find;