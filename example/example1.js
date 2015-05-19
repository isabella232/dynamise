"use strict";

var client = require("./testClient");

client.recreate("Example")
.then(function(data) {
  console.log("Wait for Example tobe Active");
  return client.active("Example");
})
.then(function(data) {
  console.log("Create 1 Item");
  return client.table("Example").create({ UserId:"1", FileId:"2"});
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
  console.log("Item", data );
  return client.table("Example").remove({ UserId:"1", FileId:"2"});
})
.then(function(data) {
  console.log("Check table after delete");
  return client.status("Example");
})
.then(function(data) {
  console.log("Example ItemCount", data.ItemCount);
  return client.remove("Example").then( function(data) {
    return client.active("Example");
  });
})
.catch(function(err) {
  if( err.code === "ResourceNotFoundException") {
    console.log("Example is gone");
  }
  else {
    console.log(err, err.stack);
  }
});
