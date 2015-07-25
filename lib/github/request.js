'use strict';

var _ = require('lodash');
var request = require('request');
var Promise = require('promise');

var etagHandler = require('./etag-handler')();

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

  function call(url) {
    var result = {};
    var options = _.assign(defaults, {'url': url});
    var etag = etagHandler.getEtag(url + token);

    if (etag) {
      options.headers['If-None-Match'] = etag;
    }

    return new Promise(function(resolve, reject) {
      request(options, function (error, response, body) {
        var message;

        if (error) {
          return reject(error);
        }

        if (response.statusCode < 200 || response.statusCode >= 400) {
          message = 'Github API Error: ';
          message += response.statusCode + ' ';
          message += response.statusMessage + '. ';
          message += JSON.parse(body).message;

          return reject(message);
        }

        // Store the results
        result.headers = response.headers;
        if (response.statusCode === 304 && etag) {
          result.json = etagHandler.getJson(url + token);
        } else {
          result.json = JSON.parse(body);
          etagHandler.store(url + token, result.json, response.headers);
        }

        return resolve(result);
      });
    });
  }

  function paginate(url) {
    var result = {'json': []};

    return new Promise(function(resolve, reject) {
      (function pager(url) {
        call(url)
          .then(function (data) {
            var next;

            if (!result.headers) {
              result.headers = data.headers;
            }
            result.json = result.json.concat(data.json);
            result.modified = data.modified;

            if (data.headers.link) {
              next = regexp.pagination.exec(data.headers.link);
              if (next) {
                return pager(next[1]);
              }
            }

            // Only resolve if we have no next pages left
            return resolve(result);
          })
          .catch(function (error) {
            return reject(error);
        });
      })(url)
    });
  };

  return {
    'call': call,
    'paginate': paginate
  };
};
