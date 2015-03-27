"use strict";

var expect = require("chai").expect;

var db = require("../../lib/"),
    testTable = require("../support/testTable");

function expectTableNonExistingError(err) {
    expect(err).to.be.instanceof(Error);
    expect(err.code).to.eql("ResourceNotFoundException");
}

function expectValidTableDescription(table, tableName) {
    expect(table).to.be.an("object");
    expect(table).to.contain.keys(["AttributeDefinitions", "CreationDateTime", "TableSizeBytes"]);
    expect(table.TableName).to.eql(tableName);
}

describe("Table", function () {

    this.timeout(5000);

    before(function () {

        db.setConnections({
            local: {
                endpoint: "http://localhost:8000"
            }
        });

        db.setTables({
            test: testTable
        });
    });

    beforeEach(function () {
        return db("local")
            .delete("test")
            //we don't care if it did not exist
            .catch(function() {
                return true;
            });
    });

    describe("#delete", function () {

        describe("with a missing table", function () {

            it("should return a 'ResourceNotFoundException'", function () {

                return db("test").delete("NonExisting")
                    .catch(function (err) {
                        expectTableNonExistingError(err);
                    });
            });
        });

        describe("with an existing table", function () {

            it("should delete the table and return table data", function () {

                var client = db("local");

                return client
                    .create("test")
                    .then(function() {
                      return client.delete("test");
                    })
                    .then(function (res) {
                        expect(res).to.be.an("object");
                        expect(res.TableDescription.TableName).to.eql("test");
                    });
            });
        });
    });

    describe("#create", function () {

        it("should create a table if passed a valid object", function () {

            var client = db("local");

            return client
                .create(testTable)
                .then(function (res) {
                    expectValidTableDescription(res.TableDescription, "test");
                });
        });

        it("should create a table if passed a table name and table has been registered before", function() {

            var client = db("local");

            return client
                .create("test")
                .then(function (res) {
                    expectValidTableDescription(res.TableDescription, "test");
                });
        });
    });


    describe("#status", function () {

        it("should fail if table does not exist", function () {

            var client = db("local");

            return client
                .status("test")
                .catch(function (err) {
                    expectTableNonExistingError(err);
                });
        });

        it("should return a subset of table description", function () {

            var client = db("local");

            return client
                .create("test")
                .then(function() {
                    return client.status("test");
                })
                .then(function (status) {
                   expect(status).to.have.keys("TableSizeBytes", "TableStatus", "ItemCount", "outdated");
                });
        });

        /*
        it("should return a table description for an existing table if passed a valid string", function () {

            return db.createTable(dummyTables.TestTable)
                .then(function () {
                    return db.describeTable(dummyTables.TestTable.TableName);
                })
                .then(function (res) {
                    expectValidTableDescription(res.Table, dummyTables.TestTable.TableName);
                });
        });

        it("should return a table description for an existing table if passed a valid object", function () {

            return db.createTable(dummyTables.TestTable)
                .then(function () {
                    return db.describeTable({TableName: dummyTables.TestTable.TableName});
                })
                .then(function (res) {
                    expectValidTableDescription(res.Table, dummyTables.TestTable.TableName);
                });
        });
        */
    });
});