import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import Application from '../containers/Application';
import configureStore from '../stores';
import { listen } from '../middlewares/socket';
import * as actions from '../actions';

const state = window.__INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const store = configureStore(_.omit(state, ['authenticated', 'page', 'repositoriesUrl']));

const { authenticated, page } = state;

listen(store);

store.dispatch(actions.emitDataToSocket(
  'user',
  { user: state.github.user, accessToken: state.github.token },
));

if (state.repositoriesUrl) {
  store.dispatch(actions.emitDataToSocket(
    'pulls',
    state.repositoriesUrl,
  ));
}

const Module = (
  <Provider store={store}>
    <Application {...{ authenticated, page }} />
  </Provider>
);

render(Module, document.getElementById('mount-application'));
