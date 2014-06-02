var assert = require('assert');
var types = require('../../lib/schemas/types');
var validate = types['any'].validate;

describe('any', function() {
  it('should null', function(done) {
    validate(null, null, done);
  });
  it('should undefined', function(done) {
    validate(undefined, null, done);
  });
  it('should boolean', function(done) {
    validate(true, null, done);
  });
  it('should number', function(done) {
    validate(123, null, done);
  });
  it('should string', function(done) {
    validate('123', null, done);
  });
  it('should array', function(done) {
    validate([], null, done);
  });
  it('should object', function(done) {
    validate({}, null, done);
  });
});