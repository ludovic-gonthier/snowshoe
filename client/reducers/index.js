import { combineReducers } from 'redux';

import { default as github } from './github';
import { default as socket } from './socket';

export default combineReducers({ github, socket });
