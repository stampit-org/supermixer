var expect = require('chai').expect;
var mixer = require('..');
var noop = require('lodash').noop;

describe('merge', function () {
  it('deep', function () {
    var o1 = { deep1: 1 };
    var o2 = { deep2: { deeper: 2 } };

    var result = mixer.merge({}, o1, o2);
    expect(result).to.have.property("deep1", 1);
    expect(result.deep2).to.be.ok;
    expect(result.deep2).to.have.property("deeper", 2);
  });

  it('ignores functions', function () {
    var o1 = { deep1: noop };
    var o2 = { deep2: { deeper: noop } };

    var result = mixer.merge({}, o1, o2);
    expect(result).to.not.have.property("deep1");
    expect(result.deep2).to.be.ok;
    expect(result.deep2).is.not.a("function");
  });
});
