import { rabbit } from '../common/rabbit';

import { organizationsConsumer } from './consumers/organizations-consumer.js';
import { pullsConsumer } from './consumers/pulls-consumer.js';
import { teamsConsumer } from './consumers/teams-consumer.js';

const consumers = {
  organizations: organizationsConsumer,
  pulls: pullsConsumer,
  teams: teamsConsumer,
};

rabbit.consume('snowshoe', 'request', (channel, message) => {
  const { data, token, type } = JSON.parse(message.content.toString());

  if (!(type in consumers)) {
    return console.error(`Unhandled type "${type}"`); // eslint-disable-line no-console
  }

  return consumers[type](token, data)
    .then(() => channel.ack(message))
    .catch((error) => console.error(error.stack)); // eslint-disable-line no-console
});
