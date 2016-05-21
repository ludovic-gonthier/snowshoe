import _ from 'lodash';

import {
  FILTER_BY_LABELS,
} from '../actions';

const initialState = {
  labels: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTER_BY_LABELS:
      return Object.assign({}, state, { labels: _.xor(state.labels, [action.label]) });
    default:
      return state;
  }
};
