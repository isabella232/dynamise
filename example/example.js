"use strict";

var ephaDb = require("../lib");

//add connection string here
var db = ephaDb("http://localhost:8000");

db.useSchemas(require("../schemas"));

//create or update Tables
db.syncTables(require("../tables/"), function(err) {

    if(err) {
        throw err;
    }

});




//now you can use your client!