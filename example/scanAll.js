"use strict";

var db = require("../lib");

var test = db("local");

test.recreate("TestTable")
  .then(function(data) {
    return test.table("TestTable").create({UserId:"1", FileId:"2"});
  })
  .then(function(data) {
    return test.table("TestTable").create({UserId:"1", FileId:"3"});
  })
  .then(function(data) {

    return test.table("TestTable")
      .scanAll({Limit: 1});
  })
  .then(function(data) {
    console.log("scan data",data);
  })
  .catch(function(err) {
    console.log(err, err.stack);
  });

