"use strict";

var client = require("./testClient");

client.recreate("Example")
.then(function(data) {
  return client.table("Example").create({UserId:"1", FileId:"2"});
})
.then(function(data) {
  return client.table("Example").create({UserId:"1", FileId:"3"});
})
.then(function(data) {
  
  var params = {
    //IndexName:
    "KeyConditions": {
      "UserId": {
          "AttributeValueList": [
              { "S": "1" }
          ],
          "ComparisonOperator": "EQ"
      },
      "FileId": {
          "AttributeValueList": [
              { "S": "3" },
              { "S": "4" }
          ],
          "ComparisonOperator": "BETWEEN"
      }
    }
  };
  
  return client.table("Example").query(params);
})
.then(function(data) {
  console.log("query data",data);
})
.catch(function(err) {
  console.log(err, err.stack);
});

