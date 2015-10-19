'use strict';

var router = require('./index').Router;

var regex = /^\/(teams|user)\//;

var tokenAccess =  function (request, response, next) {
  response.locals = {};

  if (request.query.access_token) { // eslint-disable-line no-underscore-dangle
    response.locals.accessToken = request.query.access_token; // eslint-disable-line no-underscore-dangle
  }

  next();
};

var authenticated = function (request, response, next) {
  if (request.isAuthenticated()) {
    response.locals.accessToken = request.user.accessToken;
    response.locals.user = request.user._json; // eslint-disable-line no-underscore-dangle
    response.locals.authenticated = true;
  }

  next();
};

var render = function (request, response) {
  // Setting cookie to retrieve data on the client side
  response.cookie('locals', JSON.stringify(response.locals));
  response.render('homepage', response.locals);
};

router.get(regex, tokenAccess, authenticated);

router.get('/teams/:team/:id',function (request, response, next) {
  response.locals.repositoriesUrl = '/teams/' + request.params.id + '/repos';

  next();
});
router.get('/user/personal/', function (request, response, next) {
  if (response.locals.user) {
    response.locals.repositoriesUrl = response.locals.user.repos_url; // eslint-disable-line no-underscore-dangle
  }

  next();
});
router.get('/user/contributing/', function (request, response, next) {
  response.locals.repositoriesUrl = '/user/repos?affiliation=collaborator,organization_member';

  next();
});

router.get(regex, render);
