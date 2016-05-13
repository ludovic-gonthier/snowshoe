import { createStore } from 'redux';

import { default as reducer } from '../../client/reducers';
import { initialState } from '../../client/reducers/github';

/* eslint-disable no-param-reassign */
export default function (request, response, next) {
  const { query, user } = request;
  const state = Object.assign({}, initialState);

  if (request.isAuthenticated()) {
    state.token = user.accessToken;
  }
  if (query.access_token) {
    state.token = query.access_token;
  }

  state.user = user ? user._json : null; // eslint-disable-line no-underscore-dangle

  response.state = createStore(reducer, { github: state }).getState();

  next();
}
/* eslint-enable no-param-reassign */
