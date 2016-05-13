import { rabbit } from '../../common/rabbit';
import { organizations as fetchOrganizations } from '../../common/github/fetcher';

export function organizationsConsumer(token) {
  return fetchOrganizations(token)
    .then((data) => rabbit.produce(
      'snowshoe',
      'response',
      JSON.stringify({
        type: 'organizations',
        token,
        data,
      })
    ));
}
