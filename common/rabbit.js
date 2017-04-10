import amqp from 'amqplib/callback_api';
import { format } from 'url';

import config from '../config';

let connection = null;

const connect = () => new Promise((resolve, reject) => {
  if (connection) {
    return resolve(connection);
  }

  let retries = 0;
  return (function retry() {
    return amqp.connect(format({
      protocol: 'amqp',
      hostname: config.get('rabbitmq.host'),
      port: config.get('rabbitmq.port'),
      auth: `${config.get('rabbitmq.user')}:${config.get('rabbitmq.password')}`,
    }), (error, con) => {
      if (error) {
        retries += 1;
        if (retries >= config.get('rabbitmq.retry.max_retry')) {
          reject(error);
        }

        setTimeout(retry, config.get('rabbitmq.retry.interval'));

        return true;
      }

      connection = con;

      return resolve(connection);
    });
  }());
});


const createChannel = (conn) => new Promise((resolve, reject) => {
  conn.createChannel((error, chan) => {
    if (error) {
      return reject(error);
    }

    return resolve(chan);
  });
});

export default {
  consume(exchange, queue, callback) {
    return connect()
      .then(createChannel)
      .then((channel) => {
        channel.prefetch(10);
        channel.assertExchange(exchange, 'direct', { durable: true });

        return channel.assertQueue(queue, {}, (error, mq) => {
          if (error) {
            channel.close();

            return console.error(error); // eslint-disable-line no-console
          }

          channel.bindQueue(mq.queue, exchange, queue);

          return channel.consume(mq.queue, (message) => callback(channel, message));
        });
      })
      .catch(console.error); // eslint-disable-line no-console
  },

  produce(exchange, queue, message) {
    return connect()
      .then(createChannel)
      .then((channel) => {
        channel.assertExchange(exchange, 'direct', { durable: true });

        channel.publish(exchange, queue, new Buffer(message));
        return channel.close();
      })
      .catch(console.error); // eslint-disable-line no-console
  },
};
