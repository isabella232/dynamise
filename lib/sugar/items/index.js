"use strict";

exports.create = require("./create");
exports.read = require("./read");
exports.patch = require("./patch");
exports.upsert = require("./upsert");
exports.remove = require("./remove");
exports.find = require("./find");
exports.findAll = require("./findAll");
exports.query = require("./query");
exports.scan = require("./scan");
exports.scanAll = require("./scanAll");

// functions which handle multiple items
exports.multi = require("./multi");