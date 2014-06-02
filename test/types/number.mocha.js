var assert = require('assert');
var types = require('../../lib/schemas/types');
var validate = types['number'].validate;

describe('number', function() {
  it('should integer', function(done) {
    validate(1234, null, done);
  });
  it('should double', function(done) {
    validate(12.34, null, done);
  });
  it('should not string', function(done) {
    validate('123', null, function(err) {
      assert(err);
      done();
    });
  });
});