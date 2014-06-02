var AsyncError = require('../AsyncError');

var regexes = {
  date: /\d{10}/,
  email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
}

var types = {
  any: {
    validate: function(value, field, done) {
      done();
    }
  },
  array: {
    default: [],
    fields: {
      field: false
    },
    validate: function(value, field, done) {
      if (value.constructor !== Array) return done('"' + value + '" is not an Array');
      if (field.field && value.length > 0) {
        var asyncError = new AsyncError(value.length, done);
        for (var i = 0; i < value.length; i++) {
          this.validateField(field.field, i, value[i], asyncError.getNext(i));
        }
      } else {
        done();
      }
    },
    validateKey: function(key, field, done) {
      var error = 'Array index "' + key + '" should be positive number';
      this.validateType('integer', field, key, function(err) {
        if (err) return done(error);
        if (key < 0) return done(error);
        done();
      });
    }
  },
  boolean: {
    validate: function(value, field, done) {
      if (value.constructor !== Boolean) return done('"' + value + '" is not a Boolean');
      done();
    }
  },
  date: {
    validate: function(value, field, done) {
      if (!regexes.date.test(value)) return done('"' + value + '" is not a Date');
      done();
    }
  },
  email: {
    validate: function(value, field, done) {
      if (!regexes.email.test(value)) return done('"' + value + '" is not an Email');
      done();
    }
  },
  hash: {
    default: {},
    fields: {
      collection: true,
      field: false
    },
    validate: function(value, field, done) {
      var self = this;
      self.validateType('object', field, value, function(err) {
        if (err) return done(err);
        if (field.field && Object.keys(value).length > 0) {
          var asyncError = new AsyncError(Object.keys(value).length, done);
          for (var key in value) {
            self.validateField(field.field, key, value[key], asyncError.getNext(key));
          }
        } else {
          done();
        }
      });
    },
    validateKey: function(key, field, done) {
      var self = this;
      var error = 'Hash key "' + key + '" should be id in collection "' + field.collection + '"';
      self.validateType('uuid', field, key, function(err) {
        if (err) return done(error);
        var model = self.store.createModel();
        var $doc = model.at(field.collection + '.' + key);
        model.fetch($doc, function(err) {
          if (err) return done(err);
          if (!$doc.get()) return done(error);
          done();
        });
      });
    }
  },
  integer: {
    validate: function(value, field, done) {
      this.validateType('number', field, value, function(err) {
        if (err) return done(err);
        if (value % 1 !== 0) return done('"' + value + '" is not an Integer');
        done();
      });
    }
  },
  join: {
    fields: {
      collection: true
    },
    validate: function(value, field, done) {
      var self = this;
      self.validateType('uuid', field, value, function(err) {
        if (err) return done(err);
        var model = self.store.createModel();
        var $doc = model.at(field.collection + '.' + value);
        model.fetch($doc, function(err) {
          if (err) return done(err);
          if (!$doc.get()) return done('in collection "' + field.collection + '" there is no doc with id "' + value + '"');
          done();
        });
      });
    }
  },
  number: {
    validate: function(value, field, done) {
      if (value.constructor !== Number || isNaN(value)) return done('"' + value + '" is not a Number');
      done();
    }
  },
  object: {
    default: {},
    fields: {
      fields: false
    },
    validate: function(value, field, done) {
      if (value.constructor !== Object) {
        return done('"' + value + '" is not an Object');
      }
      if (field.fields) {
        var asyncError = new AsyncError(Object.keys(field.fields).length, done);
        // Looking for excess fields
        var errors = {};
        for (var key in value) {
          if (!field.fields[key]) {
            asyncError.error(key, 'No field "' + key + '" in object fields');
          }
        }
        // Validate fields
        for (var key in field.fields) {
          var childField = field.fields[key];
          this.validateField(childField, key, value[key], asyncError.getNext(key));
        }
      } else {
        done();
      }
    }
  },
  string: {
    validate: function(value, field, done) {
      if (value.constructor !== String) return done('"' + value + '" is not a String');
      done();
    }
  },
  uuid: {
    validate: function(value, field, done) {
      if (!regexes.uuid.test(value)) return done('"' + value + '" is not an Uuid');
      done();
    }
  }
}

module.exports = types;