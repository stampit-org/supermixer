import test from 'tape';
import noop from 'lodash/noop';
import { merge } from '../src/index';

test('merging two objects', (t) => {
  const o1 = {deep1: 1};
  const o2 = {deep2: {deeper: 2}};
  const result = merge({}, o1, o2);

  t.equal(result.deep1, 1, 'should merge properties one level deep');
  t.equal(result.deep2.deeper, 2, 'should merge properties two or more levels deep');
  t.end();
});

test('merging two objects with function props', (t) => {
  const o1 = {deep1: noop};
  const o2 = {deep2: {deeper: noop}};
  const result = merge({}, o1, o2);

  t.ok(result.deep1, 'should not merge functions one level deep');
  t.equal(typeof result.deep2, 'object', 'should merge objects one level deep');
  t.ok(result.deep2.deeper, 'should not merge functions two or more levels deep');
  t.end();
});

test('add first level function', (t) => {
  const funcWithProp = () => {
  };
  funcWithProp.prop = 42;
  const result = merge({}, {last: funcWithProp});

  t.equal(result.last.prop, 42, 'should merge non existing functions one level deep');
  t.end();
});

test('add second level function', (t) => {
  const result = merge({}, {first: {last: noop}});

  t.equal(result.first.last, noop, 'should merge non existing functions two levels deep');
  t.end();
});

test('merge', (t) => {
  const o1 = {
    foo: {bar: 'bar'},
    propsOverride: false,
    func1() {}
  };
  const o2 = {
    bar: 'bar',
    propsOverride: true,
    func2() {}
  };

  const result = merge({}, o1, o2);

  t.equal(result.foo.bar, 'bar', 'Should set default props.');
  t.equal(result.bar, 'bar', 'Should let you add by chaining .props().');
  t.equal(result.propsOverride, true, 'Should let you override by chaining .props().');
  t.ok(result.func1, 'Should mix functions.');
  t.ok(result.func2, 'Should mix functions.');
  t.end();
});
