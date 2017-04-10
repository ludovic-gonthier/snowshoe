import _ from 'lodash';

/**
 * Reduce an object size by only keeping the wanted key
 * inside of it.
 *
 * @param  Object               object The object to transform
 * @param  Array<string|Object> schema An array of keys to keep
 * @return Object                      The transformed object
 */
export default function pick(object, schema) {
  let picked = {};

  _.forEach([].concat(schema), (key) => {
    if (_.isObject(key)) {
      _.forEach(key, (value, index) => {
        if (!_.has(object, index)) {
          return true;
        }

        if (_.isArray(object[index])) {
          picked[index] = object[index].map((inner) => pick(inner, value));
        } else {
          picked[index] = pick(object[index], value);
        }

        return true;
      });
    }
    if (_.has(object, key)) {
      picked = _.assign(picked, _.pick(object, key));
    }
  });

  return picked;
}
