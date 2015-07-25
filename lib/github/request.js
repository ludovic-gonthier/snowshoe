'use strict';

var request = require('request');
var parse = require('url').parse;
var querystring = require('querystring');
var _ = require('lodash');
var Promise = require('promise');

var regexp = {
  pagination: /<(.*?)>;\s+rel="next"/g
};

module.exports = function (token) {
  var defaults = {
      'headers': {
        'User-Agent': 'request',
        'Authorization': 'token ' + token
      }
    };

  return {
    call: function call(url, options) {
      options = options || {};

      if (options.per_page) {
        url = url + '?' + querystring.stringify(_.assign(
          querystring.parse(parse(url)),
          {per_page: options.per_page}  // eslint-disable-line camelcase
        ));
      }

      return new Promise(function(resolve, reject) {
        var next;
        var result = {json: [], headers: {}};

        (function paginate(apiUrl) {
          request(_.assign(defaults, {'url': apiUrl}), function (error, response, body) {
            var message;

            if (error) {
              return reject(error);
            }

            if (response.statusCode !== 200) {
              message = 'Github API Error: ';
              message += response.statusCode + ' ';
              message += response.statusMessage + '. ';
              message += JSON.parse(body).message;

              return reject(message);
            }

            // Store the results
            result.headers = response.headers;
            result.json = result.json.concat(JSON.parse(body));

            // check for pagination
            if (options.paginate && response.headers.link) {
              next = regexp.pagination.exec(response.headers.link);
              if (next) {
                return paginate(next[1]);
              }
            }

            // only resolve if we have no next pages left
            resolve(result);
          });
        })(url);
      });
    }
  };
};

module.exports.GITHUB_BASE_URL = 'https://api.github.com';
