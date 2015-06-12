import forOwn from 'lodash/object/forOwn';
import forIn from 'lodash/object/forIn';
import cloneDeep from 'lodash/lang/cloneDeep';
import isMergeable from 'lodash/lang/isObject';
import isUndefined from 'lodash/lang/isUndefined';

/**
 * Factory for creating mixin functions of all kinds.
 *
 * @param {Object} opts
 * @param {Function} opts.filter Function which filters value and key.
 * @param {Boolean} opts.chain Loop through prototype properties too.
 * @param {Boolean} opts.deep Deep looping through the nested properties.
 */
export default function mixer(opts = {}) {
  if (opts.deep && !opts._innerMixer) {
    opts._innerMixer = true; // avoiding infinite recursion.
    opts._innerMixer = mixer(opts); // create same mixer for recursion purpose.
  }

  /**
   * Combine properties from the passed objects into target. This method mutates target,
   * if you want to create a new Object pass an empty object as first param.
   *
   * @param {Object} target Target Object
   * @param {...Object} objects Objects to be combined (0...n objects).
   * @return {Object} The mixed object.
   */
  return function mix(target, ...sources) {
    if (isUndefined(target)) { // This means we have called the function. See recursion calls below.
      if (opts.deep) {
        return cloneDeep(sources[0], opts.filter);
      }

      return sources[0];
    }

    if (opts.noOverwrite) {
      if (!isMergeable(target) || !isMergeable(sources[0])) {
        return target;
      }
    }

    function iteratee(srcValue, key) {
      if (opts.filter && !opts.filter(srcValue, target[key], key)) {
        return;
      }

      target[key] = opts.deep ? opts._innerMixer(target[key], srcValue) : srcValue;
    }

    const loop = opts.chain ? forIn : forOwn;
    sources.forEach((obj) => {
      loop(obj, iteratee);
    });

    return target;
  };
}
