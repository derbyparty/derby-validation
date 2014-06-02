var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        name: {
          name: 'Test String',
          type: 'string',
          validators: {
            match: /^\d{2}$/
          }
        }
      }
    }
  }
}
var model;


describe('match', function() {
  before(function() {
    model = require('../model')(options);
  });

  it('should null', function(done) {
    model.add('tests', {name: null}, done);
  });

  it('should undefined', function(done) {
    model.add('tests', {name: undefined}, done);
  });

  it('should value in match pattern', function(done) {
    model.add('tests', {name: '12'}, done);
  });

  it('should not value not in match pattern', function(done) {
    model.add('tests', {name: '123'}, function(err) {
      assert(err);
      done();
    });
  });

  it('should not not string', function(done) {
    model.add('tests', {name: 123}, function(err) {
      assert(err);
      done();
    });
  });
});