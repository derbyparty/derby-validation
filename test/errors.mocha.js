var assert = require('assert');
var options = {
  schemas: {
    users: {
      fields: {
        values: {
          name: 'Values',
          type: 'object',
          fields: {
            hobbies: {
              name: 'Hobbies',
              type: 'array',
              field: {
                name: 'Hobby',
                type: 'string'
              }
            }
          }
        },
        age: {
          name: 'Age',
          type: 'integer'
        }
      }
    }
  }
}
var model;


describe('errors', function(){
  before(function() {
    model = require('./model')(options);
  });

  it('should create user', function(done){
    var user = {
      values: {
        hobbies: ['jogging']
      },
      age: 18
    }
    model.add('users', user, done);
  });

  it('should not create user with deep error', function(done){
    var user = {
      values: {
        hobbies: [1]
      },
      age: 18
    }
    model.add('users', user, function(err) {
      assert(err.errors.values.errors.hobbies.errors[0]);
      done();
    });
  });

  it('should not create user with two errors', function(done){
    var user = {
      values: true,
      age: 18.4
    }
    model.add('users', user, function(err) {
      assert.equal(Object.keys(err.errors).length, 2);
      assert(err.errors.values);
      assert(err.errors.age);
      done();
    });
  });

  it('should not create user with errors', function(done){
    var user = {
      name: 'Vasya',
      values: [],
      age: 17
    }
    model.add('users', user, function(err) {
      assert.equal(Object.keys(err.errors).length, 2);
      assert(err.errors.name);
      assert(err.errors.values);
      done();
    });
  });
});
