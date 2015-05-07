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
 * @param {boolean} [opts.chain=false]    Loop through prototype properties too.
 * @param {boolean} [opts.deep=false]    Deep looping through the nested properties.
 * @param {boolean} [opts.clone=false]   Do not mutate the target object. Clone it instead.
 */
var mixer = function (opts) {
  opts = opts || {};
  /**
   * Combine properties from all the objects into first one.
   * This method mutates target, if you want to create a new Object pass an empty object as first param.
   * @param {object} target    Target Object
   * @param {...object} objects    Objects to be combined (0...n objects).
   * @return {object} The mixed object.
   */
  return function supermixer(target, objects) {
    var loop = opts.chain ? forIn : forOwn;
    var i = 0,
      n = arguments.length,
      obj;
    target = opts.clone ? cloneDeep(target) : target;

    while (++i < n) {
      obj = arguments[i];
      if (obj) {
        loop(
          obj,
          function (val, key) {
            if (opts.filter && !opts.filter(val, key)) {
              return;
            }

            this[key] = opts.deep ? mergeSourceToTarget(this[key], val, opts) : val;
          },
          target);
      }
    }
    return target;
  }
};

function mergeSourceToTarget(targetVal, srcVal, opts) {
  if (opts.filter && !opts.filter(srcVal)) {
    return targetVal;
  }

  if (isObject(targetVal) && isObject(srcVal)) {
    // inception, deep merge objects
    return mixer({ deep: true })(targetVal, srcVal);
  } else {
    if (isObject(targetVal)) {
      return targetVal;
    }
    if (isObject(srcVal)) {
      return mergeSourceToTarget({}, srcVal, opts); // target is not object, but source is. Make target an object too.
    }
    // make sure arrays, regexp, date, numbers are cloned
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
  deep: true
});

/**
 * merge objects including prototype chain properties.
 */
module.exports.mergeChainNonFunctions = mixer({
  filter: isNotFunction,
  deep: true,
  chain: true
});
