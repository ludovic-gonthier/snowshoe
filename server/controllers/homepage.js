export default (router) => {
  router.get('/', (request, response) => {
    const state = Object.assign(
      {},
      response.state,
      { authenticated: request.isAuthenticated(), page: 'homepage' }
    );

    response.render('pages/homepage', { initialState: state });
  });
};
