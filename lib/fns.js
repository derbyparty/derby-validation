var AsyncError = require('./AsyncError');
var Validation = require('./Validation');

Validation.prototype.validateOp = function(collection, parts, value, done) {
  var field = this.schemas.getField(collection, parts);
  var key = parts[parts.length - 1];
  this.validateField(field, key, value, done);
}

Validation.prototype.validateField = function(field, key, value, done) {
  var self = this;
  self.validateKey(field, key, function(err) {
    if (err) return done(err);
    // Required validator always runs before type validation and other validators
    if (self.schemas.getValidator('required').call(self, value, field.validators && field.validators.required, done)) {
      self.validateType(field.type, field, value, function(err) {
        if (err) return done(err);
        self.runValidators(field, key, value, done);
      });
    }
  });
}

Validation.prototype.validateKey = function(field, key, done) {
  if (field._parent) {
    var parent = field._parent;
    var type = this.schemas.getType(parent.type);
    type.validateKey.call(this, key, parent, done);
  } else {
    done();
  }
}

Validation.prototype.validateType = function(typeKey, field, value, done) {
  if (value === null || value === undefined) return done();
  var type = this.schemas.getType(typeKey);
  type.validate.call(this, value, field, done);
}

Validation.prototype.runValidators = function(field, key, value, done) {
  if (field.validators && Object.keys(field.validators).length > 0) {
    var asyncError = new AsyncError(Object.keys(field.validators).length, done, true);
    for (var validatorType in field.validators) {
      // Skip required
      if (validatorType === 'required') {
        asyncError.next();
        continue;
      }
      // Run
      var validator = this.schemas.getValidator(validatorType);
      validator.call(this, value, field.validators[validatorType], asyncError.getNext(key));
    }
  } else {
    done();
  }
}

Validation.prototype.validateDoc = function(collection, doc, done) {
  var schema = this.schemas.getSchema(collection);
  this.validateField(schema, collection, doc, done);
}