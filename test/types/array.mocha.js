var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        array: {
          name: 'Test Array',
          type: 'array',
          field: {
            type: 'string'
          }
        }
      }
    }
  }
}
var model;


describe('array', function() {
  before(function() {
    model = require('../model')(options);
  });

  it('should add null', function(done) {
    model.add('tests', {array: null}, done);
  });

  it('should add undefined', function(done) {
    model.add('tests', {array: undefined}, done);
  });

  it('should add empty', function(done) {
    model.add('tests', {array: []}, done);
  });

  it('should not add not array', function(done) {
    model.add('tests', {array: 'not array'}, function(err) {
      assert(err);
      done();
    });
  });

  it('should add with values', function(done) {
    model.add('tests', {array: ['valid', 'valid2']}, done);
  });

  it('should not add with wrong values', function(done) {
    model.add('tests', {array: [true]}, function(err) {
      assert(err);
      done();
    });
  });

  describe('modify array', function() {
    var $test;
    beforeEach(function(done) {
      var testId = model.add('tests', {array: ['asdf']}, function(err) {
        if (err) return done(err);
        $test = model.at('tests.' + testId);
        model.fetch($test, done);
      });
    });

    it('should set', function(done) {
      $test.set('array.1', 'set', done);
    });

    it('should push', function(done) {
      $test.push('array', 'push', done);
    });

    it('should not push wrong value', function(done) {
      $test.push('array', true, function(err) {
        assert(err);
        done();
      });
    });

    it('should unshift', function(done) {
      $test.unshift('array', 'unshift', done);
    });

    it('should not unshift wrong value', function(done) {
      $test.unshift('array', false, function(err) {
        assert(err);
        done();
      });
    });

    it('should insert', function(done) {
      $test.insert('array', 0, 'insert', done);
    });

    it('should not insert wrong value', function(done) {
      $test.insert('array', 0, true, function(err) {
        assert(err);
        done();
      });
    });

    it('should pop', function(done) {
      $test.pop('array', done);
    });

    it('should shift', function(done) {
      $test.shift('array', done);
    });

    it('should remove', function(done) {
      $test.remove('array', 0, done);
    });

    it('should move', function(done) {
      $test.move('array', 0, 1, done);
    });

    it('should del', function(done) {
      $test.del('array', done);
    });
  });
});