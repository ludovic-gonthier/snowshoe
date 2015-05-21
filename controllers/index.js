'use strict';

var express = require('express');
var cookie = require('cookie');

var passport = require('./passport');
var GITHUB_BASE_URL = require('../lib/github-request').GITHUB_BASE_URL;

var router = new express.Router();

module.exports = router;

router.post('/webhooks/payload', require('./github-event'));

/*
 * Simple firewall
 */
router.all(/^((?!\/(login|auth\/github)).)/, function (request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }

  response.redirect('/login');
});

router.get('/', function (request, response) {
  var locals = {};

  locals.authenticated = request.isAuthenticated();
  locals.user = request.user._json;
  locals.accessToken = request.user.accessToken;

  // Setting cookie to retrieve data on the client side
  response.cookie('locals', JSON.stringify(locals));

  response.render('homepage', locals);
});

router.get('/teams/:team/:id', function (request, response, next) {
  var locals = {};

  locals.authenticated = request.isAuthenticated();
  locals.user = request.user._json;
  locals.accessToken = request.user.accessToken;
  locals.repositories_url = GITHUB_BASE_URL + '/teams/' + request.params.id + '/repos';

  // Setting cookie to retrieve data on the client side
  response.cookie('locals', JSON.stringify(locals));

  response.render('homepage', locals);
});

router.get('/login', function (request, response) {
  response.render('login');
});

router.get('/auth/github', passport.authenticate('github'));
router.get(
  '/auth/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  function (request, response) {
    return response.redirect('/');
  }
);

router.get('/logout', function (request, response) {
  request.logout();
  response.redirect('/');
});

/*
 * Handle 404 errors
 */
router.get('*', function(request, response){
  response.send('404 - Not Found', 404);
});
