'use strict';

var router = require('./index').Router;

/*
 * Simple firewall
 */
router.all(/^((?!\/(login|auth\/github)).)/, function (request, response, next) {
  if (request.isAuthenticated() || request.query.access_token) {
    return next();
  }

  response.redirect('/login');
});
