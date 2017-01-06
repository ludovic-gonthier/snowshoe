import { curry } from 'lodash';
import { notifyRate } from '../../../client/actions';
import '../../../common/rabbit';

import rateNotifier from '../../../common/github/rate-notifier';

import fixtures from './fixtures/rate-notifier.json';

jest.mock('lodash', () => {
  const producer = jest.fn();
  const curr = () => () => producer;

  curr.producer = producer;

  return { curry: curr };
});
jest.mock('../../../client/actions', () => ({
  notifyRate: jest.fn(),
}));
jest.mock('../../../common/rabbit');

describe('rate-notifier', () => {
  beforeEach(() => {
    curry.producer.mockReset();
    notifyRate.mockReset();
  });

  it('should send the rate informations to the socket', () => {
    const expected = {
      action: {
        type: 'NOTIFY_RATE',
        rate: {
          limit: fixtures.complete_headers.headers['x-ratelimit-limit'],
          remaining: fixtures.complete_headers.headers['x-ratelimit-remaining'],
          reset: fixtures.complete_headers.headers['x-ratelimit-reset'],
        },
      },
      token: 'test_token',
    };

    notifyRate.mockReturnValue(expected);

    const data = rateNotifier('test_token', fixtures.complete_headers);

    expect(curry.producer)
      .toHaveBeenCalledWith(JSON.stringify(expected));
    expect(notifyRate)
      .toHaveBeenCalledWith(expected.action.rate, 'test_token');
    expect(data)
      .toEqual(fixtures.complete_headers);
  });

  it('should send no informations if missing one header key', () => {
    const data = rateNotifier('test_token', fixtures.missing_headers);

    expect(data)
      .toEqual(fixtures.missing_headers);
    expect(curry.producer)
      .not
      .toHaveBeenCalled();
    expect(notifyRate)
      .not
      .toHaveBeenCalled();
  });
});
