"use strict";

var client = require("./testClient");

client.recreate("Example")
  .then(function(data) {
    return client.table("Example").create({UserId:"1", FileId:"2"});
  })
  .then(function(data) {
    return client.table("Example").create({UserId:"1", FileId:"3"});
  })
  .then(function (data) {
    return client.table("Example").create({UserId:"1", FileId:"4"});
  })
  .then(function (data) {
    return client.table("Example").create({UserId:"1", FileId:"5"});
  })
  .then(function (data) {
    return client.table("Example").create({UserId:"1", FileId:"6"});
  })
  .then(function(data) {

    return client.table("Example")
      .find()
      .where("UserId").equals("1")
      .and("FileId").ge("4")
      .exec();
  })
  .then(function(data) {
    console.log("query data",data);
  })
  .catch(function(err) {
    console.log(err, err.stack);
  });
