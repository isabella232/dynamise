"use strict";

var db = require("../lib");
var client = db("local");

client.recreate("Example")
  .then(function(data) {
    return client.table("Example").create({UserId:"1", FileId:"2"});
  })
  .then(function(data) {
    return client.table("Example").create({UserId:"1", FileId:"3"});
  })
  .then(function(data) {

    return client.table("Example")
      .find()
      .where("UserId").equals("1")
      .where("FileId").equals("2");
  })
  .then(function(data) {
    console.log("query data",data);
  })
  .catch(function(err) {
    console.log(err, err.stack);
  });

