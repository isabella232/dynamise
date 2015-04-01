var transform = require("../transform");

module.exports = function(client, tableName, params) { 
  
  return new Promise(function (resolve, reject) {
       
    params = params || {};

    params.TableName = tableName;
    // TODO filter item to keys
    params.Key = transform.to(params.Key);

    client.endpoint.getItem(params, function (err, res) {
    
      if( err) {
        reject(err);
      }
      if(!err) {
        if(res.Item) {
          res.Item = transform.from(res.Item);
        }
        resolve(res.Item);
      }
      
    });
    
  });
};