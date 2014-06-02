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
          type: 'integer',
          default: 15
        }
      }
    }
  }
}
var model;
var validation;


describe('defaults', function(){
  before(function() {
    model = require('./model')(options);
    validation = model._validationObj;
  });

  it('should create user with default values', function(done){
    var user = validation.getDefault('users');
    assert(user.id);
    delete user.id;
    assert.deepEqual(user, {values: {hobbies: []}, age: 15});
    done();
  });

  it('should create user with null values', function(done){
    var user = validation.getEmpty('users');
    assert.deepEqual(user, {values: {hobbies: null}, age: null, id: null});
    done();
  });

  it('should create array', function(done){
    var hobbies = validation.getDefault('users.values.hobbies');
    assert.deepEqual(hobbies, []);
    done();
  });

  it('should create null', function(done){
    var hobbies = validation.getEmpty('users.values.hobbies');
    assert.equal(hobbies, null);
    done();
  });

  it('should throw error', function(done){
    try {
      var hobbies = validation.getDefault('users.values.name');
    } catch (err) {
      assert(err);
      done();
    }
  });
});
