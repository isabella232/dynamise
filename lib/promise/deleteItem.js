var transform = require("../transform");

module.exports = function(client, tableName, params) { 
  
  return new Promise(function (resolve, reject) {

    params = params || {};

    params.TableName = tableName;
    params.Key = transform.to(params.Key);

    client.endpoint.deleteItem(params, function (err, res) {
      
      if(err) {
        reject(err);
      }
      if(!err) {
        resolve(res);
      }
      
    });
    
  });
  
};