import { applyMiddleware, compose, createStore } from 'redux';

import reducer from '../reducers';
import DevTools from '../containers/DevTools';
import { middleware } from '../middlewares/socket';

const enhancer = compose(
  applyMiddleware(middleware),
  DevTools.instrument(),
);

export default function store(initialState) {
  return createStore(reducer, initialState, enhancer);
}
