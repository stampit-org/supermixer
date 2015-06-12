import mixer from './mixer';
import isFunction from 'lodash/lang/isFunction';

const isNotFunction = val => !isFunction(val);

/**
 * Regular mixin function.
 */
const mixin = mixer();

/**
 * Mixin functions only.
 */
const mixinFunctions = mixer({
  filter: isFunction
});

/**
 * Mixin functions including prototype chain.
 */
const mixinChainFunctions = mixer({
  filter: isFunction,
  chain: true
});

/**
 * Regular object merge function. Ignores functions.
 */
const merge = mixer({
  filter: isNotFunction,
  deep: true
});

/**
 * Merge objects including prototype chain properties.
 */
const mergeChainNonFunctions = mixer({
  filter: isNotFunction,
  deep: true,
  chain: true
});

export default mixer;
export {
  mixin,
  mixinFunctions,
  mixinChainFunctions,
  merge,
  mergeChainNonFunctions
};
