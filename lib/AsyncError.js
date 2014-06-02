module.exports = AsyncError;

function AsyncError(count, done, first) {
  this.count = count;
  this.done = done;
  this.first = first;
  this.errors = {};
}

AsyncError.prototype.error = function(key, err) {
  this.errors[key] = err;
}

AsyncError.prototype.getNext = function(path) {
  this.path = path;
  return this.next.bind(this);
}

AsyncError.prototype.next = function(err) {
  this.count--;
  if (err) {
    if (this.first) {
      this.done(err);
      this.sent = true;
    } else {
      this.errors[this.path] = err;
    }
  }
  if (this.count === 0) {
    if (Object.keys(this.errors).length) {
      var err = new Error();
      err.errors = this.errors;
      this.done(err);
    } else if (!this.sent) {
      this.done();
    }
  }
}