"use strict";

var db = require("../lib"),
    tables = require("../tables/"),
    schemas = require("../schemas");

db.setConnections({
    local: {
        endpoint: "http://localhost:8000"
    }
});

db.setTables(tables);
db.setSchemas(schemas);

var local = db("local");

console.log(local, db("local").table("user"));


