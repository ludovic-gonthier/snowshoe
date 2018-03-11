import querystring from 'querystring';

import { FILTER_BY_LABELS, CHANGE_ORDER_DIRECTION, CHANGE_ORDER_FIELD } from 'actions';

const replaceHistoryState = (query) => {
  const stringified = querystring.stringify(query);
  let url = window.location.pathname;

  if (stringified !== '') {
    url += `?${stringified}`;
  }

  window.history.replaceState({}, document.title, url);
};

const filters = (state, action) => {
  switch (action.type) {
    // eslint-disable-next-line no-case-declarations
    case FILTER_BY_LABELS:
      const query = querystring.parse(window.location.search.replace('?', ''));

      if (state.labels.length === 0) {
        delete query.filter;
      } else {
        query.filter = state.labels;
      }

      replaceHistoryState(query);

      return state;
    default:
      return state;
  }
};

const order = (state, action) => {
  switch (action.type) {
    case CHANGE_ORDER_DIRECTION:
      replaceHistoryState(Object.assign(
        querystring.parse(window.location.search.replace('?', '')),
        { order_direction: state.direction }
      ));

      return state;
    case CHANGE_ORDER_FIELD:
      replaceHistoryState(Object.assign(
        querystring.parse(window.location.search.replace('?', '')),
        { order_field: state.field }
      ));

      return state;
    default:
      return state;
  }
};

export {
  filters,
  order,
};
