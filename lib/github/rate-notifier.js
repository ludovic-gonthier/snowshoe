'use strict';

var Promise = require('promise');

module.exports = function (socket) {
  return function notify (data) {
    socket.emit('rate', {
      'limit': data.headers['x-ratelimit-limit'] || 0,
      'remaining': data.headers['x-ratelimit-remaining'] || 0,
      'reset': data.headers['x-ratelimit-reset'] || Date.now()
    });

    return Promise.resolve(data);
  };
};


