var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        age: {
          type: 'number',
          validators: {
            positive: true
          }
        }
      }
    }
  }
}
var model;


describe('enum', function() {
  before(function() {
    model = require('../model')(options);
  });

  it('should positive', function(done) {
    model.add('tests', {age: 3}, done);
  });

  it('should zero', function(done) {
    model.add('tests', {age: 0}, done);
  });

  it('should not negative', function(done) {
    model.add('tests', {age: -2}, function(err) {
      assert(err);
      done();
    });
  });
});