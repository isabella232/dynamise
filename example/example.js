"use strict";

var db = require("../lib");

//set common configuration to simplify api calls
db("local").set(require("../tables/"));

var user = db("local").recreate("user");

user.then(function(data) {
  console.log(data);
}).catch(function(err) {
  console.log(err);
});
/*
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


 */