var db = require("../lib");

var test = db("west-1");

test.table("TestTable").create({UserId:"1", FileId:"2"})
.then(function(data) {
  return test.table("TestTable").create({UserId:"1", FileId:"4"})
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
  
  return test.table("TestTable").query(params);
})
.then(function(data) {
  console.log("query data",data);
})
.catch(function(err) {
  console.log(err);
});

