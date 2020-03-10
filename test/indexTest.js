var assert = chai.assert;
var model = require('../modules/model');

describe('Array', function () {
  it('should start empty', function () {
    var arr = [];

    assert.equal(arr.length, 0);
  });
});