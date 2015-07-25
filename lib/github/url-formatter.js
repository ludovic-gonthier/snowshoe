'use strict';

var _ = require('lodash');
var parse = require('url').parse;
var querystring = require('querystring');

var GITHUB_BASE_URL = 'https://api.github.com';
var regexp = {
  number: /\{\/number\}/,
  sha: /\{\/sha\}/,
  slash: /^\//
};

module.exports = function format(url, options) {
  if (url.indexOf('http') === -1) {
    url = [
      GITHUB_BASE_URL,
      url.replace(regexp.slash, '')
    ].join('/');
  }

  url = url.replace(regexp.number, '');
  url = url.replace(regexp.sha, '');

  if (options.per_page) {
    url += '?' + querystring.stringify(
      _.assign(
        querystring.parse(parse(url)), {
          per_page: options.per_page // eslint-disable-line camelcase
        }
      )
    );
  }

  return url;
};
