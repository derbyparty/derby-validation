var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        join: {
          name: 'Test Join',
          type: 'join',
          collection: 'categories'
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


describe('join', function() {
  before(function() {
    model = require('../model')(options);
    categoryId = model.add('categories', {name: 'Category'});
  });

  it('should add', function(done) {
    model.add('tests', {join: categoryId}, done);
  });

  it('should not add wrong type', function(done) {
    model.add('tests', {join: true}, function(err) {
      assert(err);
      done();
    });
  });

  it('should not add not uuid', function(done) {
    model.add('tests', {join: 'not uuid'}, function(err) {
      assert(err);
      done();
    });
  });

  it('should not add wrong uuid', function(done) {
    model.add('tests', {join: model.id()}, function(err) {
      assert(err);
      done();
    });
  });

  describe('modify join', function() {
    var $test;
    beforeEach(function(done) {
      var testId = model.add('tests', {join: categoryId}, function(err) {
        if (err) return done(err);
        $test = model.at('tests.' + testId);
        model.fetch($test, done);
      });
    });

    it('should set', function(done) {
      $test.set('join', categoryId, done);
    });

    it('should del', function(done) {
      $test.del('join', done);
    });
  });
});