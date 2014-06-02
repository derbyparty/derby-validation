var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        name: {
          name: 'Test String',
          type: 'string',
          validators: {
            enum: ['a', 'b', 'c']
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

  it('should null', function(done) {
    model.add('tests', {name: null}, done);
  });

  it('should undefined', function(done) {
    model.add('tests', {name: undefined}, done);
  });

  it('should value in enum', function(done) {
    model.add('tests', {name: 'a'}, done);
  });

  it('should not value not in enum', function(done) {
    model.add('tests', {name: 'd'}, function(err) {
      assert(err);
      done();
    });
  });
});