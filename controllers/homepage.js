'use strict';

var router = require('./index').Router;

router.get('/', function (request, response) {
  var locals = {};

  locals.authenticated = request.isAuthenticated();
  locals.user = request.user._json; // eslint-disable-line no-underscore-dangle
  locals.accessToken = request.user.accessToken;

  // Setting cookie to retrieve data on the client side
  response.cookie('locals', JSON.stringify(locals));

  response.render('homepage', locals);
});
