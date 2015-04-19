"use strict";

var db = require("../lib");

var test = db("local");

test.recreate("Example")
  .then(function(data) {
    return test.table("Example").create({UserId:"1", FileId:"2"});
  })
  .then(function(data) {
    return test.table("Example").create({UserId:"1", FileId:"3"});
  })
  .then(function(data) {

    return test.table("Example")
      .scan({Limit:1})
      .exec();
  })
  .then(function(data) {
    console.log("scan data",data);
  })
  .catch(function(err) {
    console.log(err, err.stack);
  });

