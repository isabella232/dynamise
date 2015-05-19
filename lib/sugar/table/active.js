"use strict";

var read = require("./read");
var tries = 0;

function active(client, tableName) {

  return new Promise(function (resolve, reject) {
    function retry() {
      tries++;

      read(client, tableName).then(function (data) {
        if (tries > 50) {
          reject(Error("Exceeded number of attempts"));
        }
        if (data.TableStatus === "ACTIVE") {
          resolve(data);
        }
        if (data.TableStatus !== "ACTIVE") {
          setTimeout(retry, 1000);
        }
      })
        .catch(function (err) {
          reject(err);
        });
    }

    retry();
  });
}

module.exports = active;