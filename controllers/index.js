'use strict';

var express = require('express');
var cookie = require('cookie');

var passport = require('./passport');

var router = new express.Router();

module.exports = router;

router.all(/^((?!\/(login|auth\/github)).)/, function (request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }

  response.redirect('/login');
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
