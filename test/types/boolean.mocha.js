var assert = require('assert');
var types = require('../../lib/schemas/types');
var validate = types['boolean'].validate;

describe('boolean', function() {
  it('should true', function(done) {
    validate(true, null, done);
  });
  it('should false', function(done) {
    validate(false, null, done);
  });
  it('should not string', function(done) {
    validate('123', null, function(err) {
      assert(err);
      done();
    });
  });
});