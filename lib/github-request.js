'use strict';

var request = require('request');
var _ = require('lodash');
var Promise = require('promise');

var regexp = {
  pagination: /<(.*?)>;\s+rel="(.*?)"/g
};

module.exports = function (token) {
  var options = {
      'headers': {
        'User-Agent': 'request',
        'Authorization': 'token ' + token
      }
    };

  return {
    GITHUB_BASE_URL: 'https://api.github.com',
    call: function (url, callback) {
      options = _.assign(options, {'url': url});

      return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
          if (error) {
            return reject(error);
          }

          if (response.statusCode == 200) {
            resolve({json: JSON.parse(body), headers: response.headers});
          } else {
            reject('Response ended with statusCode ' + response.statusCode);
          }
        });
      });
    }
  };
};
