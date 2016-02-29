import { default as _ } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import { default as Application } from '../containers/Application';
import { default as DevTools } from '../containers/DevTools';
import { default as configureStore } from '../stores';
import { listen } from '../socket';
import * as actions from '../actions';

const state = window.__INITIAL_STATE__;
const store = configureStore(_.omit(state, ['authenticated', 'page', 'repositoriesUrl']));

const { authenticated, page } = state;

listen(store);

store.dispatch(actions.emitDataToSocket(
  'user',
  { user: state.github.user, accessToken: state.github.token }
));

if (state.repositoriesUrl) {
  store.dispatch(actions.emitDataToSocket(
    'pulls',
    state.repositoriesUrl
  ));
}

let Module = (
  <Provider store={ store }>
    <div>
      <Application {...{ authenticated, page }} />
      <DevTools />
    </div>
  </Provider>
);

if (process.env.NODE_ENV === 'production') {
  Module = (
    <Provider store={ store }>
      <Application {...{ authenticated, page }} />
    </Provider>
  );
}

render(Module, document.getElementById('mount-application'));
