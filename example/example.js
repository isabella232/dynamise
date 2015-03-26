"use strict";

var ephaDb = require("../lib"),
    tables = require("../tables/"),
    schemas = require("../schemas");

var db = ephaDb("http://localhost:8000");

db.useSchemas(schemas);

db.syncTables(tables, function (err) {

    //now you can use your client!
    if (err) {
        throw err;
    }

    db.table("user").create({
        id: "u1",
        email: "sepp@epha.com",
        firstName: "Sepp"
    }).done(function (err) {

        if (err) {
            throw err;
        }

        console.log("Saved!");
    });



});

