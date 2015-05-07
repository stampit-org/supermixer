"use strict";
var forOwn = require('lodash/object/forOwn');
var forIn = require('lodash/object/forIn');
var cloneDeep = require('lodash/lang/cloneDeep');
var isObject = require('lodash/lang/isObject');
var isFunction = require('lodash/lang/isFunction');
var isNotFunction = function (val) { return !isFunction(val); };

/**
 * Creates mixin functions of all kinds.
 * @param {object} opts    Options.
 * @param {function(object, string)} opts.filter    Function which filters value and key.
 * @param {boolean} opts.chain    Loop through prototype properties too.
 * @param {function(object)} opts.getTarget    Converts an object object to a target. Executed once.
 * @param {function(object, object)} opts.getValue    Converts src and dst values to a new value. Executed per property.
 */
var mixer = function (opts) {
  opts = opts || {};
  /**
   * Combine properties from all the objects into first one.
   * This method mutates target, if you want to create a new Object pass an empty object as first param.
   * @param {object} target    Target Object
   * @param {object[]} objects    Objects to be combined (0...n objects).
   * @return {object} Target Object.
   */
  return function supermixer(target, objects) {
    var loop = opts.chain ? forIn : forOwn;
    var i = 0,
      n = arguments.length,
      obj;
    target = opts.getTarget ? opts.getTarget(target) : target;

    while (++i < n) {
      obj = arguments[i];
      if (obj) {
        loop(
          obj,
          function (val, key) {
            if (opts.filter && !opts.filter(val, key)) {
              return;
            }

            this[key] = opts.getValue ? opts.getValue(this[key], val) : val;
          },
          target);
      }
    }
    return target;
  }
};

var mergeAll = mixer({
  getTarget: cloneDeep,
  getValue: mergeSourceToTarget
});

function mergeSourceToTarget(targetVal, srcVal) {
  if (isObject(targetVal) && isObject(srcVal)) {
    // inception, deep merge objects
    return mergeAll(targetVal, srcVal);
  } else {
    // make sure arrays, regexp, date, objects are cloned
    return cloneDeep(srcVal);
  }
}

module.exports = mixer;

/**
 * Regular mixin function.
 */
module.exports.mixin = mixer();

/**
 * mixin for functions only.
 */
module.exports.mixinFunctions = mixer({
  filter: isFunction
});

/**
 * mixin for functions including prototype chain.
 */
module.exports.mixinChainFunctions = mixer({
  filter: isFunction,
  chain: true
});

/**
 * Regular object merge function. Ignores functions.
 */
module.exports.merge = mixer({
  filter: isNotFunction,
  getTarget: cloneDeep,
  getValue: mergeSourceToTarget
});

/**
 * lodash.cloneDeep
 */
module.exports.cloneDeep = cloneDeep;

/**
 * It deep merges the source object to the target property. Uses itself recursively.
 */
module.exports.mergeSourceToTarget = mergeSourceToTarget;

/**
 * merge objects including prototype chain properties.
 */
module.exports.mergeChainNonFunctions = mixer({
  filter: isNotFunction,
  getTarget: cloneDeep,
  getValue: mergeSourceToTarget,
  chain: true
});
