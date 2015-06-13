import test from 'tape';
import mixer from '../src/index';

test('all options work together', (t) => {
  var mix = mixer({
    filter(sourceValue, targetValue, key) { return key[0] !== '_'; },
    transform(resultingValue, targetValue, key) { return key === 'name' ? 'new name' : resultingValue; },
    chain: true,
    deep: true,
    noOverwrite: true
  });

  // Using tape.Test as a good example of a complex object.
  const obj = new test.Test('old name');
  obj.deep = { deeper: true };
  const result = mix({ readable: 'no overwrite please' }, obj);

  t.equal(obj.readable, true, 'pre check source object');
  t.notEqual(obj.name, 'new name', 'pre check source object');

  t.ok(result.assert, 'should grab prototype properties');
  t.ok(result.emit, 'should grab prototype of prototype properties');
  t.notOk(result._ok, 'should filter out private properties');
  t.notOk(result._skip, 'should filter out private properties');
  t.notOk(result._end, 'should filter out private properties');
  t.notOk(result._assert, 'should filter out private properties');
  t.ok(result.deep.deeper, 'should grab deep properties');
  t.equal(result.name, 'new name', 'should transform values');
  t.equal(result.readable, 'no overwrite please', 'should not overwrite properties');

  t.end();
});

