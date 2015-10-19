'use strict';

var _ = require('lodash');
var parse = require('url').parse;
var format = require('url').format;
var querystring = require('querystring');

var GITHUB_BASE_URL = 'https://api.github.com';
var regexp = {
  number: /\{\/number\}/,
  sha: /\{\/sha\}/,
  slash: /^\//
};

module.exports = function (url, options) {
  var parsed;

  if (url.indexOf('http') === -1) {
    url = [
      GITHUB_BASE_URL,
      url.replace(regexp.slash, '')
    ].join('/');
  }

  url = url.replace(regexp.number, '');
  url = url.replace(regexp.sha, '');

  parsed = parse(url);
  url = format({
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    pathname: parsed.pathname,
    query: _.assign({}, querystring.parse(parsed.query), _.pick(options, 'per_page'))
  });

  return url;
};
