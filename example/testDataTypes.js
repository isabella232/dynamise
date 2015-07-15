"use strict";

var client = require("./testClient");

client.recreate("Example")
  .then(function() {
    console.log("Wait for Example tobe Active");
    return client.active("Example");
  })
  .then(function() {
    console.log("Create 1 Item");
    return client.table("Example").create({
      UserId:"1",
      FileId:"2",
      branches: ["refactoring#blub", "fun", "bugfixing"],
      releases: [1, "lu", 3],
      myMap: {
        a: "b",
        b: "c",
        c: "d"
      }
    });
  })
  .then(function(data) {
    console.log("Check table again");
    return client.status("Example");
  })
  .then(function(data) {
    console.log("Example ItemCount", data.ItemCount);
    return client.table("Example").read("1", "2");
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    if( err.code === "ResourceNotFoundException") {
      console.log("Example is gone");
    }
    else {
      console.log(err, err.stack);
    }
  });
