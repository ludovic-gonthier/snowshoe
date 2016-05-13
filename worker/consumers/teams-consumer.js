import { rabbit } from '../../common/rabbit';
import { teams as fetchTeams } from '../../common/github/fetcher';

export function teamsConsumer(token, login) {
  return fetchTeams(token, login)
    .then(data => rabbit.produce(
      'snowshoe',
      'response',
      JSON.stringify({
        type: 'teams',
        token,
        data,
      })
    ));
}
