var racer = require('racer');
var Memory = require('racer/node_modules/share/node_modules/livedb/lib/memory');
var Validation = require('../lib');
var store = racer.createStore({db: new Memory()});

module.exports = function(options) {
  var validation = new Validation(options);
  validation.setupStore(store);
  var model = store.createModel();
  model._validationObj = validation
  return model;
}