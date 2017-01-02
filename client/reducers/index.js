import { combineReducers } from 'redux';

import filters from './filters';
import github from './github';
import order from './order';
import socket from './socket';

export default combineReducers({ filters, github, order, socket });
