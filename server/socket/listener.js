import _ from 'lodash';

import config from '../../config';
import Poller from '../poller';
import rabbit from '../../common/rabbit';

const registry = new Map();
const producer = _.curry(rabbit.produce)('snowshoe', 'request');

rabbit.consume(
  'snowshoe',
  'response',
  (channel, message) => {
    const { action, token } = JSON.parse(message.content.toString());

    if (registry.has(token)) {
      registry
        .get(token)
        .forEach((socket) => socket.emit('action', action));
    }

    channel.ack(message);
  },
);

const poller = new Poller(config.get('snowshoe.refresh.rate'));
poller.callback = (data) => {
  producer(JSON.stringify({
    data: data.url,
    token: data.token,
    type: 'pulls',
  }));
};

export const connection = {
  socket: 0,
  user: 0,
};

export default function (socket) {
  connection.socket += 1;

  socket.on('disconnect', () => {
    connection.socket -= 1;
    registry.set(socket.token, _.filter(registry.get(socket.token), (soc) => socket.id !== soc.id));

    if (!registry.get(socket.token).length) {
      connection.user -= 1;
      registry.delete(socket.token);
      poller.unregister(socket.token);
    }

    socket = null; // eslint-disable-line no-param-reassign
  });

  socket.on('error', (error) => {
    /* eslint-disable no-console */
    console.error('[Socket error]');
    console.dir(error);
    console.error('[/Socket error]');
    /* eslint-enable no-console */
  });

  socket.on('user', (data) => {
    const token = data.accessToken;

    if (!registry.has(token)) {
      connection.user += 1;
      registry.set(token, []);
    }

    registry.get(token).push(socket);

    socket.token = token; // eslint-disable-line no-param-reassign
    socket.on('pulls', (url) => {
      const object = {
        url,
        token,
      };

      if (!poller.has(token)) {
        poller.register(object);
      }

      poller.callback(object);
    });

    producer(JSON.stringify({
      token,
      type: 'organizations',
    }));

    socket.on('teams', (organizationLogin) => {
      producer(JSON.stringify({
        data: organizationLogin,
        token,
        type: 'teams',
      }));
    });
  });
}
