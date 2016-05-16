import { curry } from 'lodash';
import { rabbit } from '../rabbit';

import { notifyRate } from '../../client/actions';

const producer = curry(rabbit.produce)('snowshoe', 'response');

export function rateNotifier(token, data) {
  if (data.headers['x-ratelimit-limit']
     && data.headers['x-ratelimit-remaining']
     && data.headers['x-ratelimit-reset']) {
    producer(JSON.stringify(notifyRate({
      limit: data.headers['x-ratelimit-limit'],
      remaining: data.headers['x-ratelimit-remaining'],
      reset: data.headers['x-ratelimit-reset'],
    }, token)));
  }

  return data;
}
