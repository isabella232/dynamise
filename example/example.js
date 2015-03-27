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
 console.log(err, err.stack);
 });
 */

//check if table exists (maybe .exists() method later on?)
db("local").status("user")
    .catch(function (err) {

        //create if not exists
        if (err.code === "ResourceNotFoundException") {
            return db("local").create("user");
        }

        //forward error to global handler if a different error occurend
        throw err;
    })
    .then(function () {
        //fetch the status
        return db("local").status("user");
    })
    .then(function (res) {
        console.log("status", res);
    })
    .catch(function (err) {
        console.log(err.message, err.stack);
    });

