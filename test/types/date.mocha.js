var assert = require('assert');
var types = require('../../lib/schemas/types');
var validate = types['date'].validate;

describe('date', function() {
  it('should unix date', function(done) {
    validate(+new Date(), null, done);
  });
  it('should not date', function(done) {
    validate(new Date(), null, function(err) {
      assert(err);
      done();
    });
  });
});