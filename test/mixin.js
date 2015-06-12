import test from 'tape';
import noop from 'lodash/utility/noop';

import { mixin } from '../src/index';

test('mixin two objects', (t) => {
  const o1 = { number: 1 };
  const o2 = { obj: { deeper: 2 } };
  const result = mixin({}, o1, o2);

  t.equal(result.number, 1, 'should mix base types');
  t.equal(result.obj.deeper, 2, 'should mix complex objects');
  t.end();
});

test('mixin two objects with function props', (t) => {
  const o1 = { func1: noop };
  const o2 = { func2: noop };
  const result = mixin({}, o1, o2);

  t.ok(result.func1, 'should mix functions');
  t.ok(result.func1, 'should mix multiple objects functions');
  t.end();
});
