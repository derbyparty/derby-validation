var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        integer: {
          name: 'Test Integer',
          type: 'integer'
        }
      }
    }
  }
}
var model;


describe('integer', function() {
  before(function() {
    model = require('../model')(options);
  });

  it('should add integer', function(done) {
    model.add('tests', {integer: 1234}, done);
  });

  it('should not add not integer', function(done) {
    model.add('tests', {integer: 'not integer'}, function(err) {
      assert(err);
      done();
    });
  });

  it('should not add double', function(done) {
    model.add('tests', {integer: 12.34}, function(err) {
      assert(err);
      done();
    });
  });

  describe('modify integer', function() {
    var $test;
    beforeEach(function(done) {
      var testId = model.add('tests', {integer: 100}, function(err) {
        if (err) return done(err);
        $test = model.at('tests.' + testId);
        model.fetch($test, done);
      });
    });

    it('should increment', function(done) {
      $test.increment('integer', 10, done);
    });

    it('should del', function(done) {
      $test.del('integer', done);
    });
  });
});