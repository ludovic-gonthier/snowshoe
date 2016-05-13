export default (router) => {
  router.get('/teams/:team/:id', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    response.state.repositoriesUrl = `/teams/${request.params.id}/repos`;
    response.state.page = 'organization';
    /* eslint-enable no-param-reassign */

    next();
  });
  router.get('/user/personal/', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    if (response.state.github.user) {
      response.state.repositoriesUrl = response.state.github.user.repos_url;
    }

    response.state.page = 'personnal';
    /* eslint-enable no-param-reassign */


    next();
  });
  router.get('/user/contributing/', (request, response, next) => {
    /* eslint-disable no-param-reassign */
    response.state.repositoriesUrl = '/user/repos?affiliation=collaborator,organization_member';
    response.state.page = 'contributing';
    /* eslint-enable no-param-reassign */


    next();
  });

  router.get(/^\/(teams|user)\//, (request, response) => {
    const state = Object.assign(
      {},
      response.state,
      { authenticated: request.isAuthenticated() }
    );

    // Setting cookie to retrieve data on the client side
    response.render('pages/homepage', { initialState: state });
  });
};
