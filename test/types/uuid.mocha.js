var assert = require('assert');
var types = require('../../lib/schemas/types');
var validate = types['uuid'].validate;

describe('uuid', function() {
  it('should uuid', function(done){
    validate('550e8400-e29b-41d4-a716-446655440000', null, done);
  });
  it('should not string', function(done) {
    validate('asdf', null, function(err) {
      assert(err);
      done();
    });
  });
  it('should not number', function(done) {
    validate(123, null, function(err) {
      assert(err);
      done();
    });
  });
});