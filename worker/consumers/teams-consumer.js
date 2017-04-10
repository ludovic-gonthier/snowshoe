import { receivedTeams } from '../../client/actions';
import { teams as fetchTeams } from '../../common/github/fetcher';
import rabbit from '../../common/rabbit';
import rateNotifier from '../../common/github/rate-notifier';

export default function teamsConsumer(token, login) {
  return fetchTeams(token, login)
    .then((data) => {
      rabbit.produce(
        'snowshoe',
        'response',
        JSON.stringify(receivedTeams(data.json, token)),
      );

      return data;
    })
    .then((data) => rateNotifier(token, data));
}
