"use strict";

var db = require("../lib");

// set common configuration to simplify api calls
// db("local").set( { "TEST2:" tableDefinition } );

var test = db("local");

test.recreate("Example")
.then(function(data) {
  console.log("Wait for Example tobe Active");
  return test.active("Example");
})
.then(function(data) {
  console.log("Create 1 Item");
  return test.table("Example").create({ UserId:"1", FileId:"2"});
})
.then(function(data) {
  console.log("Check table again");
  return test.status("Example");
})
.then(function(data) {
  console.log("Example ItemCount", data.ItemCount);
  return test.table("Example").read("1", "2");
})
.then(function(data) {
  console.log("Item", data );
  return test.table("Example").delete({ UserId:"1", FileId:"2"});
})
.then(function(data) {
  console.log("Check table after delete");
  return test.status("Example");
})
.then(function(data) {
  console.log("Example ItemCount", data.ItemCount);
  return test.delete("Example").then( function(data) {
    return test.active("Example");
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
