var chai = require('chai')
var assert = chai.assert;

import Model from '../model.js'


describe('Array', function () {
  it('should start empty', function () {
    var arr = [];

    const t = new Model()

    console.log(t.getUrl(''))

    assert.equal(arr.length, 0);
  });
});