"use strict";

var inspect = require("util").inspect;
var _ = require("lodash");

/**
 * Makes it possible to work off sequentially
 * over an items array with only a certain amount
 * off tasks parallel (concurrency)
 *
 * @param {Array} items
 * @param {Function} promiseFn
 * @param {Number} concurrency
 * @returns {Promise}
 */
function throttledParallel(items, promiseFn, concurrency) {

  concurrency = concurrency || 10;
  var tmp = _.chunk(items, concurrency);

  function doRequest() {
    var payload = tmp.shift();

    if (payload === undefined) {
      return null;
    }

    return Promise.all(payload.map(function (item) {
      return promiseFn.call(this, item);
    }))
      .then(function () {
        return doRequest();
      });
  }

  return doRequest();
}

/**
 * Promisify setTimeout()
 * This is used to delay an action in Promise style.
 * Will wait for a certain amount of time until resolving.
 *
 * @param {number} ms
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

/**
 * Does an console.log with pre-configured util.inspect.
 * Used for debugging purposes.
 *
 * @param obj
 */
function i(obj) {
  console.log(inspect(obj, {depth: null, colors: true}));
}

exports.throttledParallel = throttledParallel;
exports.delay = delay;
exports.i = i;