var transform = require("../transform");

module.exports = function(client, tableName, item, params) { 
  
  return new Promise(function (resolve, reject) {

    var params = params || {};

    params.TableName = tableName;
    params.Item = transform.to(item);

    client.endpoint.updateItem(params, function (err, res) {
      
      if(err) {
        reject(err);
      }
      if(!err) {
        resolve(res);
      }
      
    });
    
  });
  
};