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

    var client;

    this.timeout(5000);

    before(function () {

        db.setConnections({
            local: {
                endpoint: "http://localhost:8000"
            }
        });
    });

    beforeEach(function () {

        client = db("local");

        //reset tables
        db.setTables({
            test: testTable
        });

        return client
            .delete("test")
            //we don't care if it did not exist
            .catch(function () {
                return true;
            });
    });

    describe("#delete", function () {

        describe("with a missing table", function () {

            it("should return a 'ResourceNotFoundException'", function () {

                return client.delete("NonExisting")
                    .catch(function (err) {
                        expectTableNonExistingError(err);
                    });
            });
        });

        describe("with an existing table", function () {

            it("should delete the table and return table data", function () {

                return client
                    .create("test")
                    .then(function () {
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

            return client
                .create(testTable)
                .then(function (res) {
                    expectValidTableDescription(res.TableDescription, "test");
                });
        });

        it("should create a table if passed a table name and table has been registered before", function () {

            return client
                .create("test")
                .then(function (res) {
                    expectValidTableDescription(res.TableDescription, "test");
                });
        });
    });


    describe("#status", function () {

        it("should fail if table does not exist", function () {

            return client
                .status("test")
                .catch(function (err) {
                    expectTableNonExistingError(err);
                });
        });

        it("should return a subset of table description", function () {

            return client
                .create("test")
                .then(function () {
                    return client.status("test");
                })
                .then(function (status) {
                    expect(status).to.have.keys("TableSizeBytes", "TableStatus", "ItemCount");
                });
        });


        //TODO not working with simple diff https://github.com/epha/model/issues/2
        it.skip("should return outdated = false if the local table definition and table description are equal", function () {

            return client
                .create("test")
                .then(function () {
                    return client.status("test");
                })
                .then(function (status) {
                    expect(status.outdated).to.eql(false);
                });
        });

        it.skip("should return outdated = true if the local table definition and table description differ", function () {

            db.setTables({
                test: {
                    TableName: "test",
                    AttributeDefinitions: [
                        {AttributeName: "id", AttributeType: "S"}
                    ],
                    KeySchema: [
                        {AttributeName: "id", KeyType: "HASH"}
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    },
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: "idIndex",
                            KeySchema: [
                                {AttributeName: "id", KeyType: "HASH"}
                            ],
                            Projection: {
                                ProjectionType: "ALL"
                            },
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 20,
                                WriteCapacityUnits: 30
                            }
                        }
                    ]
                }
            });

            return client
                .create(testTable)
                .then(function () {
                    return client.status("test");
                })
                .then(function (status) {
                    expect(status.outdated).to.eql(true);
                });
        });
    });
});