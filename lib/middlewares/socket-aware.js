'use strict';

var io = require('../../server').io;

module.exports = function () {
  return function (request, response, next) {
    request.io = io;
    next();
  };
};
