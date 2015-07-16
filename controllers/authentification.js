'use strict';

var passport = require('./passport');

var router = require('./index').Router;

router.get('/login', function (request, response) {
  response.render('login');
});

router.get(
  '/auth/github',
  passport.authenticate('github', {
    scope: process.env.GITHUB_SCOPES || ['repo', 'user', 'read:org']
  })
);
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
