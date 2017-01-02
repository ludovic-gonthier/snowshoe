import { createStore } from 'redux';

import config from '../../config';
import reducer from '../../client/reducers';
import { initialState } from '../../client/reducers/github';

/* eslint-disable no-param-reassign */
export default function (request, response, next) {
  const { query, user } = request;
  const state = Object.assign({}, initialState);
  const order = {
    direction: config.get('snowshoe.pulls.sort.direction'),
    field: config.get('snowshoe.pulls.sort.key'),
  };

  if (request.isAuthenticated()) {
    state.token = user.accessToken;
  }
  if (query.access_token) {
    state.token = query.access_token;
  }

  state.user = user ? user._json : null; // eslint-disable-line no-underscore-dangle

  response.state = createStore(reducer, { github: state, order }).getState();

  next();
}
/* eslint-enable no-param-reassign */
