"use strict";

var expect = require("chai").expect;
var testTable = require("../../../support/testTables").test;
var expectTableNonExistingError = require("../../../support/helpers").expectTableNonExistingError;

describe("client.listTables()", function () {

  var client = require("../../../support/testClient");

  beforeEach(function () {
    return client.recreate(testTable);
  });

  //AccessDeniedException: User: arn:aws:iam::740920311122:user/testDynamo is not authorized to perform: dynamodb:ListTables on resource: *
  it.skip("should return a valid tables object with all existing tables", function () {

    return client.listTables()
      .then(function (tables) {
        expect(tables).to.have.property("TableNames");
        expect(tables.TableNames).to.be.instanceof(Array);
        expect(tables.TableNames).to.contain(testTable.TableName);
      });
  });

});