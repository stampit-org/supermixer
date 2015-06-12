import test from 'tape';
import noop from 'lodash/utility/noop';
import { merge } from '../src/index';

test('merging two objects', (t) => {
  const o1 = { deep1: 1 };
  const o2 = { deep2: { deeper: 2 } };
  const result = merge({}, o1, o2);

  t.equal(result.deep1, 1, 'should merge properties one level deep');
  t.equal(result.deep2.deeper, 2, 'should merge properties two or more levels deep');
  t.end();
});

test('merging two objects with function props', (t) => {
  const o1 = { deep1: noop };
  const o2 = { deep2: { deeper: noop } };
  const result = merge({}, o1, o2);

  t.ok(result.deep1, 'should not merge functions one level deep');
  t.equal(typeof result.deep2, 'object', 'should merge objects one level deep');
  t.ok(result.deep2.deeper, 'should not merge functions two or more levels deep');
  t.end();
});
