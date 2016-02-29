import { default as configureStore } from '../../client/stores';

export default (router) => {
  router.get('/', (request, response) => {
    const store = configureStore();
    const state = store.getState();

    state.github.token = '';

    if (request.isAuthenticated()) {
      state.github.token = request.user.accessToken;
      state.github.user = request.user._json; // eslint-disable-line no-underscore-dangle
    }

    if (request.query.access_token) { // eslint-disable-line no-underscore-dangle
      state.github.token = request.query.access_token; // eslint-disable-line no-underscore-dangle
    }

    state.authenticated = request.isAuthenticated();
    state.page = 'homepage';

    response.render('pages/homepage', { initialState: state });
  });
};
