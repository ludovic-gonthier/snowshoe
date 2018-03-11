import { combineReducers } from 'redux';

import github from 'reducers/github';
import socket from 'reducers/socket';

import 'reducers';

jest.mock('redux', () => ({
  combineReducers: jest.fn(),
}));
jest.mock('reducers/filters');
jest.mock('reducers/github');
jest.mock('reducers/order');
jest.mock('reducers/socket');
jest.mock('reducers/history');

describe('[Reducers - index', () => {
  it('should combine all reducers', () => {
    expect(combineReducers)
      .toBeCalledWith({
        filters: expect.any(Function),
        github,
        order: expect.any(Function),
        socket,
      });
  });
});
