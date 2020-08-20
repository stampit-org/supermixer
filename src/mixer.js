import forOwn from 'lodash/forOwn';
import forIn from 'lodash/forIn';
import cloneDeep from 'lodash/cloneDeep';
import isMergeable from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';

/**
 * Factory for creating mixin functions of all kinds.
 *
 * @param {Object} opts
 * @param {Function} opts.filter Function which filters value and key.
 * @param {Function} opts.transform Function which transforms each value.
 * @param {Boolean} opts.chain Loop through prototype properties too.
 * @param {Boolean} opts.deep Deep looping through the nested properties.
 * @param {Boolean} opts.noOverwrite Do not overwrite any existing data (aka first one wins).
 * @return {Function} A new mix function.
 */
export default function mixer(opts = {}) {
  // We will be recursively calling the exact same function when walking deeper.
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
     // Check if it's us who called the function. See recursion calls are below.
    if (isUndefined(target) || (!opts.noOverwrite && !isMergeable(target))) {
      if (sources.length > 1) {
        // Weird, but someone (not us!) called this mixer with an incorrect first argument.
        return opts._innerMixer({}, ...sources);
      }
      return cloneDeep(sources[0]);
    }

    if (opts.noOverwrite) {
      if (!isMergeable(target) || !isMergeable(sources[0])) {
        return target;
      }
    }

    function iteratee(sourceValue, key) {
      if (key === 'constructor' && typeof sourceValue === 'function') return;
      if (key == '__proto__') return;

      const targetValue = target[key];
      if (opts.filter && !opts.filter(sourceValue, targetValue, key)) {
        return;
      }

      const result = opts.deep ? opts._innerMixer(targetValue, sourceValue) : sourceValue;
      target[key] = opts.transform ? opts.transform(result, targetValue, key) : result;
    }

    const loop = opts.chain ? forIn : forOwn;
    sources.forEach((obj) => {
      loop(obj, iteratee);
    });

    return target;
  };
}
