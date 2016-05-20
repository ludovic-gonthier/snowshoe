import { rabbit } from '../../common/rabbit';
import { organizations as fetchOrganizations } from '../../common/github/fetcher';
import { rateNotifier } from '../../common/github/rate-notifier';

export function organizationsConsumer(token) {
  return fetchOrganizations(token)
    .then((data) => {
      rabbit.produce(
        'snowshoe',
        'response',
        JSON.stringify({
          type: 'organizations',
          token,
          data: data.json,
        })
      );

      return data;
    })
    .then((data) => rateNotifier(token, data));
}
