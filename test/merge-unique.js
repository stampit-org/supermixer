import test from 'tape';
import noop from 'lodash/noop';
import { mergeUnique } from '../src/index';

test('uniquely merging two objects', (t) => {
  const original = 'original';
  const o1 = { deep1: 1 };
  const o2 = { deep2: { deeper: 2 } };
  const result = mergeUnique({ deep1: original, deep2: { deeper: original } }, o1, o2, { last: 1 });

  t.equal(result.deep1, original, 'should not merge existing properties one level deep');
  t.equal(result.deep2.deeper, original, 'should not merge existing properties two or more levels deep');
  t.equal(result.last, 1, 'also should merge non existing properties one level deep');
  t.end();
});

test('uniquely merging two objects with function props', (t) => {
  const original = () => {};
  const o1 = { deep1: noop };
  const o2 = { deep2: { deeper: noop } };
  const result = mergeUnique({ deep1: original, deep2: { deeper: original } }, o1, o2, { last: 1 });

  t.equal(result.deep1, original, 'should not merge existing functions one level deep');
  t.equal(result.deep2.deeper, original, 'should not merge existing functions two or more levels deep');
  t.equal(result.last, 1, 'also should merge non existing properties one level deep');
  t.end();
});
