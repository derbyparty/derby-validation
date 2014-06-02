var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        name: {
          name: 'Test String',
          type: 'string',
          validators: {
            max: 3
          }
        },
        age: {
          type: 'number',
          validators: {
            max: 10
          }
        },
        hobbies: {
          type: 'array',
          validators: {
            max: 2
          }
        }
      }
    }
  }
}
var model;


describe('max', function() {
  before(function() {
    model = require('../model')(options);
  });

  it('should string less than max', function(done) {
    model.add('tests', {name: 'a'}, done);
  });

  it('should not string more than max', function(done) {
    model.add('tests', {name: 'dodo'}, function(err) {
      assert(err);
      done();
    });
  });

  it('should number less than max', function(done) {
    model.add('tests', {age: 5}, done);
  });

  it('should not number more than max', function(done) {
    model.add('tests', {age: 15}, function(err) {
      assert(err);
      done();
    });
  });

  it('should array less than max', function(done) {
    model.add('tests', {hobbies: ['linux']}, done);
  });

  it('should not array more than max', function(done) {
    model.add('tests', {hobbies: ['jazz', 'boxing', 'sex']}, function(err) {
      assert(err);
      done();
    });
  });
});