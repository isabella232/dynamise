"use strict";

var inspect = require("util").inspect;

var dynamo = require("../../dynamo");
var addCondition = require("../utils").addCondition;

function Find(client, tableName, params) {
  // prepare params object
  params = params || {};
  params.TableName = params.TableName || tableName;
  params.KeyConditions = params.KeyConditions || {};

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
}

Find.prototype.where = function(key) {
  var self = this;

  return {
    // on a hash key, only an equals condition is allowed!
    equals: function(value) {
      addCondition(self.params, key, value, "EQ");
      return self;
    }
  }
};

Find.prototype.and = function(key) {
  var self = this;

  return {
    equals: function(value) {
      addCondition(self.params, key, value, "EQ");
      return self;
    },
    beginsWith: function(value) {
      addCondition(self.params, key, value, "BEGINS_WITH");
      return self;
    },
    lt: function(value) {
      addCondition(self.params, key, value, "LT");
      return self;
    },
    le: function(value) {
      addCondition(self.params, key, value, "LE");
      return self;
    },
    between: function (value) {
      addCondition(self.params, key, value, "BETWEEN");
      return self;
    },
    gt: function (value) {
      addCondition(self.params, key, value, "GT");
      return self;
    },
    ge: function (value) {
      addCondition(self.params, key, value, "GE");
      return self;
    }
  }
};

Find.prototype.exec = function() {
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