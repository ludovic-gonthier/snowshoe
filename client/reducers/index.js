import { combineReducers } from 'redux';

import filters from 'reducers/filters';
import github from 'reducers/github';
import * as history from 'reducers/history';
import order from 'reducers/order';
import socket from 'reducers/socket';

export default combineReducers({
  filters: (state, action) => history.filters(filters(state, action), action),
  github,
  order: (state, action) => history.order(order(state, action), action),
  socket,
});
