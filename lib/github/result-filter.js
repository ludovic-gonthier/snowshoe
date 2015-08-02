'use strict';

var _ = require('lodash');

var picker = require('./object-picker');

var schemas = {
  repository: ['pulls_url', 'issues_url'],
  team: ['id', 'slug', 'name'],
  organization: ['login'],
  status: ['state'],
  issue: [
    'id',
    'comments',
    {
      labels: ['color', 'name']
    },
    {
      pull_request: 'url' // eslint-disable-line camelcase
    }
  ],
  pull: [
    'id',
    'statuses_url',
    {
      base: [{
        repo: 'name'
      }]
    },
    {
      user: ['avatar_url', 'login']
    },
    'title',
    'html_url',
    'number',
    'updated_at',
    'url',
    'state',
    'locked'
  ]
};

/**
 * Filter the API output by applying the
 * object-picker for the given object type
 *
 * @param  Object data The result to filter
 * @param  string type The object type (must match a defined schema)
 *
 * @return Object      The filtered result
 *
 * @throws Error If No schema defined for the given type
 */
module.exports = function (data, type) {
  var picked = [];

  if (schemas[type] === undefined) {
    throw new Error('No "' + type + ' schema defined in "config/object/"');
  }

  if (_.isArray(data)) {
    _.forEach(data, function (value) {
      picked.push(picker(value, schemas[type]));
    });

    return picked;
  }

  return picker(data, schemas[type]);
};
