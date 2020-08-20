import test from 'tape';
import noop from 'lodash/noop';
import {mixinChainFunctions} from '../src/index';

function isGeneratorSupported() {
  try {
    eval('(function*(){})()');
    return true;
  } catch (err) {
    return false;
  }
}

if (isGeneratorSupported()) {
  test('uniquely merging two objects with function props', (t) => {
    const noopGen = function *gen() {};
    const proto = {f: noop, g: noopGen};
    const o = Object.create(proto);
    o.fOwn = noop;
    o.gOwn = noopGen;
    const result = mixinChainFunctions({}, o);

    t.equal(result.fOwn, noop,
      'should assign function');
    t.equal(result.gOwn, noopGen,
      'should assign generator from prototype');
    t.equal(result.f, noop,
      'should assign function from prototype');
    t.equal(result.g, noopGen,
      'should assign generator from prototype');

    t.end();
  });
}
