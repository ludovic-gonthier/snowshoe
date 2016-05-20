import { curry } from 'lodash';
import { rabbit } from '../rabbit';

const producer = curry(rabbit.produce)('snowshoe', 'response');

export function rateNotifier(token, data) {
  if (data.headers['x-ratelimit-limit']
     && data.headers['x-ratelimit-remaining']
     && data.headers['x-ratelimit-reset']) {
    producer(JSON.stringify({
      type: 'rate',
      token,
      data: {
        limit: data.headers['x-ratelimit-limit'],
        remaining: data.headers['x-ratelimit-remaining'],
        reset: data.headers['x-ratelimit-reset'],
      },
    }));
  }

  return data;
}
