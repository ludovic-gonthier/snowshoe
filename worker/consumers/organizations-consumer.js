import { receivedOrgnizations } from '../../client/actions';
import rabbit from '../../common/rabbit';
import { organizations as fetchOrganizations } from '../../common/github/fetcher';
import rateNotifier from '../../common/github/rate-notifier';

export default function organizationsConsumer(token) {
  return fetchOrganizations(token)
    .then((data) => {
      rabbit.produce(
        'snowshoe',
        'response',
        JSON.stringify(receivedOrgnizations(data.json, token)),
      );

      return data;
    })
    .then((data) => rateNotifier(token, data));
}
