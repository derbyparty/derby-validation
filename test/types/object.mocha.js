var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        object: {
          name: 'Test Object',
          type: 'object',
          fields: {
            name: {
              type: 'string'
            }
          }
        }
      }
    },
    nofieldstests: {
      fields: {
        object: {
          name: 'Empty object',
          type: 'object'
        }
      }
    }
  }
}
var model;


describe('object', function() {
  before(function() {
    model = require('../model')(options);
  });

  it('should add empty', function(done) {
    model.add('tests', {object: {}}, done);
  });

  it('should not add not object', function(done) {
    model.add('tests', {object: 'not object'}, function(err) {
      assert(err);
      done();
    });
  });

  it('should add with values', function(done) {
    model.add('tests', {object: {name: 'asdf'}}, done);
  });

  it('should not add with wrong keys', function(done) {
    model.add('tests', {object: {wrong: 'asdf'}}, function(err) {
      assert(err);
      done();
    });
  });

  it('should not add with wrong values', function(done) {
    model.add('tests', {object: {name: true}}, function(err) {
      assert(err);
      done();
    });
  });

  describe('nofields', function(){
    it('should add empty', function(done) {
      model.add('nofieldstests', {object: {}}, done);
    });

    it('should add not empty', function(done) {
      model.add('nofieldstests', {object: {name: 'not empty'}}, done);
    });

    it('should not add not object', function(done) {
      model.add('nofieldstests', {object: 'not object'}, function(err) {
        assert(err);
        done();
      });
    });
  });

  describe('modify', function() {
    var $test;
    beforeEach(function(done) {
      var testId = model.add('tests', {object: {name: 'asdf'}}, function(err) {
        if (err) return done(err);
        $test = model.at('tests.' + testId);
        model.fetch($test, done);
      });
    });

    it('should set', function(done) {
      $test.set('object.name', 'set', done);
    });

    it('should del key', function(done) {
      $test.del('object.name', done);
    });

    it('should del', function(done) {
      $test.del('object', done);
    });
  });
});