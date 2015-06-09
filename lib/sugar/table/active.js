"use strict";

var read = require("./read");

function active(client, tableName) {
  var tries = 0;

  return new Promise(function (resolve, reject) {
    function retry() {
      tries++;
      read(client, tableName).then(function (data) {
        if (tries > active.maxRetries) {
          reject(Error("Exceeded number of attempts"));
          return;
        }

        if (data.TableStatus === "ACTIVE") {
          resolve(data);
        } else {
          setTimeout(retry, active.retryDelay);
        }

      })
        .catch(function (err) {
          reject(err);
        });
    }

    retry();
  });
}

active.maxRetries = 50;
active.retryDelay = 1000;

module.exports = active;