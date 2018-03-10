export default (router) => {
  router.get('/teams/:team/:id', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    response.locals.state.repositoriesUrl = `/teams/${request.params.id}/repos`;
    response.locals.state.page = 'organization';
    /* eslint-enable no-param-reassign */

    next();
  });
  router.get('/user/personal/', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    if (response.locals.state.github.user) {
      response.locals.state.repositoriesUrl = response.locals.state.github.user.repos_url;
    }

    response.locals.state.page = 'personnal';
    /* eslint-enable no-param-reassign */


    next();
  });
  router.get('/user/contributing/', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    response.locals.state.repositoriesUrl = '/user/repos?affiliation=collaborator,organization_member';
    response.locals.state.page = 'contributing';
    /* eslint-enable no-param-reassign */

    next();
  });

  router.get(/^\/(teams|user)\//, (request, response) => {
    const state = Object.assign(
      {},
      response.locals.state,
      { authenticated: request.isAuthenticated() },
    );

    // Setting cookie to retrieve data on the client side
    response.render('pages/homepage', { initialState: state });
  });
};
