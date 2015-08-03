'use strict';

var _ = require('lodash');

/**
 * Reduce an object size by only keeping the wanted key
 * inside of it.
 *
 * @param  Object               object The object to transform
 * @param  Array<string|Object> schema An array of keys to keep
 * @return Object                      The transformed object
 */
module.exports = function pick(object, schema) {
  var picked = {};

  schema = [].concat(schema);

  _.forEach(schema, function (key) {
    if (_.isObject(key)) {
      _.forEach(key, function (value, index) {
        if (!_.has(object, index)) {
          return true;
        }

        if (_.isArray(object[index])) {
          picked[index] = [];

          _.forEach(object[index], function (innerObject) {
            picked[index].push(pick(innerObject, value));
          });
        } else {
          picked[index] = pick(object[index], value);
        }
      });
    } else if (_.has(object, key)) {
      picked = _.assign(picked, _.pick(object, key));
    }
  });

  return picked;
};
