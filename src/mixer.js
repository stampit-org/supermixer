import forOwn from 'lodash/object/forOwn';
import forIn from 'lodash/object/forIn';
import cloneDeep from 'lodash/lang/cloneDeep';
import isObject from 'lodash/lang/isObject';

let mergeSourceToTarget;

/**
 * Factory for creating mixin functions of all kinds.
 *
 * @param {Object} opts
 * @param {Function} opts.filter Function which filters value and key.
 * @param {Boolean} opts.chain Loop through prototype properties too.
 * @param {Boolean} opts.deep Deep looping through the nested properties.
 * @param {Boolean} opts.clone Do not mutate the target object. Clone it instead.
 */
export default function mixer(opts) {
  opts = opts || {};

  /**
   * Combine properties from the passed objects into target. This method mutates target,
   * if you want to create a new Object pass an empty object as first param.
   *
   * @param {Object} target Target Object
   * @param {...Object} objects Objects to be combined (0...n objects).
   * @return {Object} The mixed object.
   */
  return (target, ...objects) => {
    const loop = opts.chain ? forIn : forOwn;
    const iteratee = function (val, key) {
      if (opts.filter && !opts.filter(val, key)) {
        return;
      }

      this[key] = opts.deep ? mergeSourceToTarget(this[key], val, opts) : val;
    };

    target = opts.clone ? cloneDeep(target) : target;

    objects.forEach((obj) => {
      loop(obj, iteratee, target);
    });

    return target;
  };
}

mergeSourceToTarget = function (targetVal, srcVal, opts) {
  const isTargObj = isObject(targetVal);
  const isSrcObj = isObject(srcVal);

  if (isTargObj && !isSrcObj) {
    return targetVal;
  } else if (isTargObj && isSrcObj) {
    /**
     * Inception, deep merge objects
     */
    return mixer(opts)(targetVal, srcVal);
  } else if (isSrcObj) {
    /**
     * Target is not object, but source is. Make target an object too.
     */
    return mergeSourceToTarget({}, srcVal, opts);
  }

  /**
   * Make sure arrays, regexp, date, numbers are cloned
   */
  return cloneDeep(srcVal);
};
