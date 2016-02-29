import { default as configureStore } from '../../client/stores';

const regex = /^\/(teams|user)\//;

/* eslint-disable no-param-reassign */
const tokenAccess = (request, response, next) => {
  const store = configureStore();

  response.locals = store.getState();

  if (request.query.access_token) {
    response.locals.github.token = request.query.access_token;
  }

  next();
};

const authenticated = (request, response, next) => {
  response.locals.authenticated = false;

  if (request.isAuthenticated()) {
    response.locals.github.token = request.user.accessToken;
    response.locals.github.user = request.user._json; // eslint-disable-line no-underscore-dangle
    response.locals.authenticated = true;
  }

  next();
};
/* eslint-enable no-param-reassign */

const render = (request, response) => {
  // Setting cookie to retrieve data on the client side
  response.render('pages/homepage', { initialState: response.locals });
};

export default (router) => {
  router.get(regex, tokenAccess, authenticated);

  router.get('/teams/:team/:id', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    response.locals.repositoriesUrl = `/teams/${request.params.id}/repos`;
    response.locals.page = 'organization';
    /* eslint-enable no-param-reassign */

    next();
  });
  router.get('/user/personal/', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    if (response.locals.github.user) {
      response.locals.repositoriesUrl = response.locals.github.user.repos_url;
    }

    response.locals.page = 'personnal';
    /* eslint-enable no-param-reassign */


    next();
  });
  router.get('/user/contributing/', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    response.locals.repositoriesUrl = '/user/repos?affiliation=collaborator,organization_member';
    response.locals.page = 'contributing';
    /* eslint-enable no-param-reassign */


    next();
  });

  router.get(regex, render);
};
