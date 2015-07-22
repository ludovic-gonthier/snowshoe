'use strict';

var router = require('./index').Router;

var GITHUB_BASE_URL = require('../lib/github-request').GITHUB_BASE_URL;

router.get('/teams/:team/:id', function (request, response) {
  var locals = {};

  locals.accessToken = '';

  if (request.isAuthenticated()) {
    locals.accessToken = request.user.accessToken;
    locals.user = request.user._json; // eslint-disable-line no-underscore-dangle
  }

  if (request.query.access_token) { // eslint-disable-line no-underscore-dangle
    locals.accessToken = request.query.access_token; // eslint-disable-line no-underscore-dangle
  }

  locals.authenticated = request.isAuthenticated();
  locals.repositoriesUrl = GITHUB_BASE_URL + '/teams/' + request.params.id + '/repos';

  // Setting cookie to retrieve data on the client side
  response.cookie('locals', JSON.stringify(locals));

  response.render('homepage', locals);
});
