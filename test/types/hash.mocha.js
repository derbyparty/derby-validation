var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        hash: {
          name: 'Test Hash',
          type: 'hash',
          collection: 'categories',
          field: {
            type: 'string'
          }
        }
      }
    },
    categories: {
      fields: {
        name: {
          type: 'string'
        }
      }
    }
  }
}
var model;
var categoryId;


describe('hash', function() {
  before(function() {
    model = require('../model')(options);
    categoryId = model.add('categories', {name: 'Category'});
  });

  it('should add empty', function(done) {
    model.add('tests', {hash: {}}, done);
  });

  it('should not add not hash', function(done) {
    model.add('tests', {hash: 'not hash'}, function(err) {
      assert(err);
      done();
    });
  });

  it('should add with values', function(done) {
    var test = {hash: {}};
    test.hash[categoryId] = 'asdf';
    model.add('tests', test, done);
  });

  it('should not add with wrong key', function(done) {
    model.add('tests', {hash: {wrongkey: {}}}, function(err) {
      assert(err);
      done();
    });
  });

  it('should not add with wrong value', function(done) {
    var test = {hash: {}};
    test.hash[categoryId] = true;
    model.add('tests', test, function(err) {
      assert(err);
      done();
    });
  });

  describe('modify hash', function() {
    var $test;
    beforeEach(function(done) {
      var test = {hash: {}};
      test.hash[categoryId] = 'asdf';
      var testId = model.add('tests', test, function(err) {
        if (err) return done(err);
        $test = model.at('tests.' + testId);
        model.fetch($test, done);
      });
    });

    it('should set', function(done) {
      $test.set('hash.' + categoryId, 'set', done);
    });

    it('should not set wrong key', function(done) {
      $test.set('hash.wrongkey', 'set', function(err) {
        assert(err);
        done();
      });
    });

    it('should not set wrong value', function(done) {
      $test.set('hash.' + categoryId, true, function(err) {
        assert(err);
        done();
      });
    });

    it('should del', function(done) {
      $test.del('hash', done);
    });

    it('should del key', function(done) {
      $test.del('hash.' + categoryId, done);
    });
  });
});