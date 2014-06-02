var AsyncError = require('./AsyncError');

module.exports = Validation;

function Validation(options) {
  options = options || {};
  this.schemas.init(options);
}

Validation.prototype.setupStore = function(store) {
  this.store = store;
  var self = this;

  store.shareClient.use('submit', function(shareRequest, done) {
    var collection = shareRequest.collection;
    var opData = shareRequest.opData;
    //console.log(JSON.stringify(opData));

    if (opData.create) {
      // Create
      var doc = opData.create.data;
      return self.validateDoc(collection, doc, done);
    } else if (opData.del) {
      // Delete
      return done();
    } else {
      // Change
      var asyncError = new AsyncError(opData.op.length, done);
      for (var i = 0; i < opData.op.length; i++) {
        var op = opData.op[i];
        var parts = op.p;
        var value;

        // Object insert or object replace
        if (op.oi !== undefined) {
          value = op.oi;
        // Object delete
        } else if (op.od !== undefined) {
          // TODO: check if required
          return done();
        // List insert or list replace
        } else if (op.li !== undefined) {
          value = op.li;
        // List remove
        } else if (op.ld !== undefined) {
          return done();
        // List move
        } else if (op.lm !== undefined) {
          return done();
        // String insert
        } else if (op.si !== undefined) {
          return done();
        // String remove
        } else if (op.sd !== undefined) {
          return done();
        // Increment
        } else if (op.na !== undefined) {
          value = op.na;
        }

        self.validateOp(collection, parts, value, asyncError.getNext(parts.join('.')));
      }
    }
  });
}