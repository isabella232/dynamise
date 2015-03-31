"use strict";

var db = require("../lib");

// set common configuration to simplify api calls
// db("local").set( { "TEST2:" tableDefinition } );

var test = db("local");

test.recreate("TestTable")
.then(function(data) {
  console.log("Wait for TestTable tobe Active");
  return test.active("TestTable");
})
.then(function(data) {
  console.log("Create 1 Item");
  return test.table("TestTable").create({ UserId:"1", FileId:"2"});
})
.then(function(data) {
  console.log("Check table again");
  return test.status("TestTable");
})
.then(function(data) {
  console.log("TestTable ItemCount", data.ItemCount);
  return test.table("TestTable").read({ UserId:"1", FileId:"2"});
})
.then(function(data) {
  console.log("Item", data );
  return test.table("TestTable").delete({ UserId:"1", FileId:"2"});
})
.then(function(data) {
  console.log("Check table after delete");
  return test.status("TestTable");
})
.then(function(data) {
  console.log("TestTable ItemCount", data.ItemCount);
  return test.delete("TestTable").then( function(data) {
    return test.active("TestTable");
  });
})
.catch(function(err) {
  if( err.code == "ResourceNotFoundException") {
    console.log("TestTable is gone");
  }
  else {
    console.log(err);
  }
});
