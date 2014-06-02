var Validation = require('../Validation');
var types = require('./types');
var validators = require('./validators');
var util = require('../util');
var schemas;
var defaultFields = {
  id: {
    type: 'uuid',
    default: function() {
      var model = this.store.createModel();
      return model.id();
    }
  }
}

Validation.prototype.schemas = {
  getField: getField,
  getSchema: getSchema,
  getType: getType,
  getValidator: getValidator,
  init: init
}

Validation.prototype.getDefault = function(path) {
  var field = parsePath(path, getField);
  return this.getDefaultOrEmpty(field, true);
}

Validation.prototype.getEmpty = function(path) {
  var field = parsePath(path, getField);
  return this.getDefaultOrEmpty(field);
}

function parsePath(path, done) {
  var parts = path.split('.');
  var collection = parts.shift();
  return done(collection, parts);
}

Validation.prototype.getDefaultOrEmpty = function(field, isDefault) {
  var result = null;
  var type = getType(field.type);
  var defaultProperty = field.default || type.default;
  if (isDefault && defaultProperty) {
    if (typeof defaultProperty === 'function') {
      result = defaultProperty.call(this);
    } else {
      result = util.clone(defaultProperty);
    }
  }
  if (field.fields) {
    // Object can not be null, because schema itself is object
    if (!result) result = {};
    for (var key in field.fields) {
      result[key] = this.getDefaultOrEmpty(field.fields[key], isDefault);
    }
  }
  return result;
}

function getField(collection, parts) {
  var schema = getSchema(collection);
  var field = schema;
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (field.field) {
      var parent = field;
      field = field.field;
      field._parent = parent;
    } else if (field.fields && field.fields[part]) {
      field = field.fields[part];
    } else {
      throw new Error('There is no field "' + part + '" for path "' + parts.join('.') + '" in schema "' + collection + '"');
    }
  }
  return field;
}

function getSchema(collection) {
  var schema = schemas[collection];
  if (!schema) throw new Error('No schema for collection "' + collection + '"');
  return schema;
}

function getType(key) {
  return types[key];
}

function getValidator(key) {
  return validators[key];
}

function init(options) {
  if (options.schemas) {
    var fields = options.fields || defaultFields;
    for (var collection in options.schemas) {
      var schema = options.schemas[collection];
      // Doc by default is Object
      schema.type = schema.type || 'object';
      schema.fields = schema.fields || {};
      for (var key in fields) {
        schema.fields[key] = fields[key];
      }
      validateSchemaField(schema, [collection]);
    }
    schemas = options.schemas;
  }

  if (options.types) {
    for (var key in options.types) {
      var type = options.types[key];
      // TODO: validate type
      types[key] = type;
    }
  }

  if (options.validators) {
    for (var key in options.validators) {
      var validator = options.validators[key];
      // TODO: validate validator
      validators[key] = validator;
    }
  }
}

function validateSchemaField(field, parts) {
  var path = parts.join('.');
  if (!field.type) throw new Error('Field "' + path + '" should have property "type"');
  var type = getType(field.type);
  if (!type) throw new Error('Unknown type "' + field.type + '" for field "' + path + '"');
  if (type.fields) {
    for (var key in type.fields) {
      var fieldRequired = type.fields[key];
      if (fieldRequired && !field[key]) throw new Error('Field "' + path + '" should have property "' + key + '"');

      if (key === 'field' && field.field) {
        validateSchemaField(field.field, parts.concat(['_field_']));
      } else if (key === 'fields' && field.fields) {
        for (var fieldKey in field.fields) {
          validateSchemaField(field.fields[fieldKey], parts.concat([fieldKey]));
        }
      }
    }
  }
}