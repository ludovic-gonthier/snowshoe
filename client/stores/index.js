import { applyMiddleware, compose, createStore } from 'redux';

import { default as reducer } from '../reducers';
import { default as DevTools } from '../containers/DevTools';
import { middleware } from '../middlewares/socket';

const enhancer = compose(
  applyMiddleware(middleware),
  DevTools.instrument()
);

export default function store(initialState) {
  return createStore(reducer, initialState, enhancer);
}
