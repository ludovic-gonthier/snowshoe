import { combineReducers } from 'redux';

import { default as filters } from './filters';
import { default as github } from './github';
import { default as order } from './order';
import { default as socket } from './socket';

export default combineReducers({ filters, github, order, socket });
