import { combineReducers } from 'redux';

import filters from 'reducers/filters';
import github from 'reducers/github';
import order from 'reducers/order';
import socket from 'reducers/socket';

export default combineReducers({ filters, github, order, socket });
