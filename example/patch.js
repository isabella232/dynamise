"use strict";

var client = require("./testClient");

var item = {
  UserId: "1",
  FileId: "wonder#ful",
  Email: "m@epha.com",
  Role: "Admin",
  Points: "3"
};

client.recreate("Example")
  .then(function () {
    return client.table("Example").create(item);
  })
  .then(function () {
    return client.table("Example").download();
  })
  .then(function (res) {
    console.log(res);

    var obj = res[0];
    return client.table("Example").patch({
      UserId: obj.UserId,
      FileId: obj.FileId,
      Email: "d@epha.com",
      Points: null,
      Another: "value"
    });
  })
  .then(function () {
    return client.table("Example").download();
  })
  .then(function (res) {
    console.log('----------------\n', res);
  })
  .catch(function (err) {
    console.trace(err);
  });
