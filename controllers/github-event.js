'use strict';

var handler = {};

handler.ping = function (request) {
  console.log('ping received');
};
handler.pull_request = function (request) {
  console.log(request.body);
};
handler.commit_comment = function (request) {
  console.log(request.body);
};
handler.status = function (request) {
  console.log(request.body);
};

module.exports = function (request, response, next) {
  var event = request.headers['x-github-event'] || '';
  var error;

  if (!handler[event]) {
    error = new Error('Not Implemented');
    error.code = 501;

    return next(error);
  }

  handler[event](request);

  response.statusCode = 200;
  response.send('OK');
};
