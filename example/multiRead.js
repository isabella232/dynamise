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

    var params = {
      RequestItems: {
        Example:{
          Keys:[
            {UserId:"1", FileId:"2"},
            {UserId:"1", FileId:"3"}
          ]
        }
      }
    };
  
    return test.multiRead(params);
  })
  .then(function(data) {
    console.log("multiRead",data);
  })
  .catch(function(err) {
    console.log(err, err.stack);
  });
