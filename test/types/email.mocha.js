var assert = require('assert');
var types = require('../../lib/schemas/types');
var validate = types['email'].validate;

describe('email', function() {
  it('should email', function(done) {
    validate('email@company.com', null, done);
  });
  it('should not string', function(done) {
    validate('notemail', null, function(err) {
      assert(err);
      done();
    });
  });
});