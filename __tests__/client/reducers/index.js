import { combineReducers } from 'redux';

import filters from 'reducers/filters';
import github from 'reducers/github';
import order from 'reducers/order';
import socket from 'reducers/socket';

import 'reducers';

jest.mock('redux', () => ({
  combineReducers: jest.fn(),
}));
jest.mock('reducers/filters');
jest.mock('reducers/github');
jest.mock('reducers/order');
jest.mock('reducers/socket');

describe('[Reducers - index', () => {
  it('should combine all reducers', () => {
    expect(combineReducers)
      .toBeCalledWith({
        filters,
        github,
        order,
        socket,
      });
  });
});
