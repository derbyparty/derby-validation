var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        age: {
          type: 'number'
        }
      }
    },
    requiredtests: {
      fields: {
        age: {
          type: 'number',
          validators: {
            required: true
          }
        }
      }
    }
  }
}
var model;


describe('required', function() {
  before(function() {
    model = require('../model')(options);
  });

  describe('not required', function() {
    it('should null', function(done) {
      model.add('tests', {age: null}, done);
    });

    it('should undefined', function(done) {
      model.add('tests', {age: undefined}, done);
    });

    it('should empty', function(done) {
      model.add('tests', {}, done);
    });

    it('should value', function(done) {
      model.add('tests', {age: 4}, done);
    });
  });

  describe('required', function() {
    it('should not null', function(done) {
      model.add('requiredtests', {age: null}, function(err) {
        assert(err);
        done();
      });
    });

    it('should not undefined', function(done) {
      model.add('requiredtests', {age: undefined}, function(err) {
        assert(err);
        done();
      });
    });

    it('should not empty', function(done) {
      model.add('requiredtests', {}, function(err) {
        assert(err);
        done();
      });
    });

    it('should value', function(done) {
      model.add('requiredtests', {age: 4}, done);
    });
  });
});