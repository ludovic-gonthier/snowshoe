import amqp from 'amqplib/callback_api';

import { format } from 'url';

import { config } from '../config';

let connection = null;

const connect = () => new Promise((resolve) => {
  if (connection) {
    return resolve(connection);
  }

  if (process.env.NODE_ENV === 'test') {
    return null;
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
        if (retries++ >= config.get('rabbitmq.retry.max_retry')) {
          throw error;
        }

        return setTimeout(retry, config.get('rabbitmq.retry.interval'));
      }

      connection = con;

      return resolve(connection);
    });
  }());
});


const createChannel = () => new Promise((resolve, reject) => {
  connection.createChannel((error, chan) => {
    if (error) {
      return reject(error);
    }

    return resolve(chan);
  });
});

export const rabbit = {
  consume(exchange, queue, callback) {
    connect()
      .then(createChannel)
      .then((channel) => {
        channel.assertExchange(exchange, 'direct', { durable: true });

        channel.assertQueue(queue, {}, (error, mq) => {
          if (error) {
            return console.error(error); // eslint-disable-line no-console
          }

          channel.bindQueue(mq.queue, exchange, queue);

          return channel.consume(mq.queue, message => callback(channel, message));
        });
      })
      .catch((error) => console.error(error)); // eslint-disable-line no-console
  },

  produce(exchange, queue, message) {
    connect()
      .then(createChannel)
      .then((channel) => {
        channel.assertExchange(exchange, 'direct', { durable: true });

        channel.publish(exchange, queue, new Buffer(message));
        channel.close();
      })
      .catch((error) => console.error(error)); // eslint-disable-line no-console
  },
};
