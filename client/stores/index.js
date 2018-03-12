import { applyMiddleware, compose, createStore } from 'redux';

import reducer from '../reducers';
import { middleware } from '../middlewares/socket';

const enhancer = compose(
  applyMiddleware(middleware),
);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default function store(initialState) {
  return createStore(reducer, initialState, enhancer);
}
