"use strict";

/*
 * Will build UpdateExpression according to spec
 * @except Keys which can not change
 */
module.exports = function( item, except) {

  var names = {};
  var values = {};
  var setExp = [];
  var removeExp = [];
  var deleteExp = [];
  
  getKeys(item).forEach(function(item,index) {
    
    if( item.key in except ) return;
    
    var value = ":valu"+index;
    var keys = item.key.split(".");
    
    keys.forEach( function(key) {
      names[ "#"+key] = key;
    });
       
    if(item.value == null && keys.length == 1) {
      deleteExp.push("#"+keys.join(".#"));
    }
    if(item.value == null && keys.length > 1) {
      removeExp.push("#"+keys.join(".#"));
    }
    if(item.value != null) {
      values[value] = item.value;
      setExp.push("#"+keys.join(".#")+" = "+value);
    }   
    
  });

  var expression = "";

  if( setExp.length ) expression += " SET "+ setExp.join(",");
  if( removeExp.length ) expression += " REMOVE "+ removeExp.join(",");
  if( deleteExp.length ) expression += " DELETE "+ deleteExp.join(",");

  return {
    names:names,
    values:values,
    expression:expression
  };

};

/*
 * Lists all nested keys
 * @returns [{ key:"a.b",value:"2 }]
 */
var getKeys = function (obj, path, allKeys) {
  path = path || '';
  allKeys = allKeys || [];

  var keys = Object.keys(obj);
  var value, key;

  for (var i = 0; i < keys.length; i += 1) {
      value = obj[keys[i]];
      key = path + keys[i];
      if (value instanceof Object) {
          getKeys(value, key +'.', allKeys);
      } else {
          allKeys.push({ key:key, value:value });
      }
  }
  return allKeys;
};



