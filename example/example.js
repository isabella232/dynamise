"use strict";

var db = require("../lib"),
    tables = require("../tables/"),
    schemas = require("../schemas");

//set common configuration to simplify api calls
db.setConnections({
    local: {
        endpoint: "http://localhost:8000"
    }
});

db.setTables(tables);
db.setSchemas(schemas);

//db("local").create("user"); //or .create(tables.user) //-> an object with table definition

/*
db("local").read("user")
    .then(function (res) {
        console.log(res);
    })
    .catch(function (err) {
        //TODO throw err gets caught..
        console.log(err, err.stack);
    });
*/

db("local").status("user")
    .then(function (res) {
        console.log("status", res);
    })
    .catch(function (err) {
        console.log(err.message, err.stack);
    });

