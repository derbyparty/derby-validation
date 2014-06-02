var assert = require('assert');
var types = require('../../lib/schemas/types');
var validate = types['string'].validate;

describe('string', function() {
  it('should string', function(done) {
    validate('str', null, done);
  });
  it('should empty string', function(done) {
    validate('', null, done);
  });
  it('should not number', function(done) {
    validate(123, null, function(err) {
      assert(err);
      done();
    });
  });
});