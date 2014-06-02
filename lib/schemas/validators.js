var validators = {
  enum: function(value, en, done) {
    console.log(value, en);
    if (en.indexOf(value) === -1) return done('"' + value + '" is not in "' + en.join(', ') + '"');
    done();
  },
  match: function(value, match, done) {
    console.log(value, match);
    if (typeof value !== 'string') return done('"' + value + '" should be string to use match validator');
    if (!match.test(value)) return done('"' + value + '" does not match format');
    done();
  },
  max: function(value, max, done) {
    var err = 'should be less then ' + max;
    if (typeof value === 'number' && value > max) return done(err);
    if (value && value.length > max) return done(err);
    done();
  },
  min: function(value, min, done) {
    var err = 'should be more then ' + min;
    if (typeof value === 'number' && value < min) return done(err);
    if (value && value.length < min) return done(err);
    done();
  },
  positive: function(value, positive, done) {
    if (positive && typeof value === 'number' && value < 0) return done('is not positive');
    done();
  },
  required: function(value, required, done) {
    if (value === null || value === undefined) {
      if (required) {
        done('is required');
      }
      else {
        done();
      }
      // No need to run type validation and other validators, because we do not have value
      return false;
    }
    // Value is neither null, nor undefined
    // So we can run type validation and other validators
    return true;
  }
}

module.exports = validators;