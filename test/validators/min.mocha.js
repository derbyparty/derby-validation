var assert = require('assert');
var options = {
  schemas: {
    tests: {
      fields: {
        name: {
          name: 'Test String',
          type: 'string',
          validators: {
            min: 3
          }
        },
        age: {
          type: 'number',
          validators: {
            min: 10
          }
        },
        hobbies: {
          type: 'array',
          validators: {
            min: 2
          }
        }
      }
    }
  }
}
var model;


describe('min', function() {
  before(function() {
    model = require('../model')(options);
  });

  it('should string more than min', function(done) {
    model.add('tests', {name: 'abab'}, done);
  });

  it('should not string less than min', function(done) {
    model.add('tests', {name: 'd'}, function(err) {
      assert(err);
      done();
    });
  });

  it('should number more than min', function(done) {
    model.add('tests', {age: 15}, done);
  });

  it('should not number less than min', function(done) {
    model.add('tests', {age: 5}, function(err) {
      assert(err);
      done();
    });
  });

  it('should array more than min', function(done) {
    model.add('tests', {hobbies: ['jazz', 'boxing', 'sex']}, done);
  });

  it('should not array less than min', function(done) {
    model.add('tests', {hobbies: ['pokemons']}, function(err) {
      assert(err);
      done();
    });
  });
});