import amqp from 'amqplib/callback_api';
import { format } from 'url';

import config from '../../config';
import rabbit from '../../common/rabbit';

jest.mock('amqplib/callback_api', () => ({
  connect: jest.fn(),
}));
jest.mock('url', () => ({
  format: jest.fn(),
}));
jest.mock('../../config', () => ({
  get: jest.fn(),
}));

describe('rabbit', () => {
  const connection = {
    createChannel: jest.fn(),
  };
  const channel = {
    assertExchange: jest.fn(),
    assertQueue: jest.fn(),
    bindQueue: jest.fn(),
    close: jest.fn(),
    consume: jest.fn(),
    prefetch: jest.fn(),
    publish: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.clearAllTimers();
  });

  describe('connection retry', () => {
    it('should fail when max retry reached', () => {
      config.get.mockImplementation((key) => {
        switch (key) {
          case 'rabbitmq.host': return 'the.host';
          case 'rabbitmq.port': return 3030;
          case 'rabbitmq.user': return 'the_user';
          case 'rabbitmq.password': return 'the_password';
          case 'rabbitmq.retry.max_retry': return 1;
          case 'rabbitmq.retry.interval': return 1000;
          default: return '';
        }
      });

      format.mockImplementationOnce(() => 'amqp://the_user:the_password@the_host:3030');

      amqp.connect.mockImplementationOnce((param, callback) => {
        callback(Error('Connection failed'));
      });

      /* eslint-disable no-console */
      console.error = jest.fn();
      console.error.mockImplementationOnce(() => '');
      /* eslint-enable no-console */

      return rabbit.consume('test_exchange', 'test_queue', jest.fn())
        .then(() => {
          expect(amqp.connect)
            .toHaveBeenCalled();
          expect(connection.createChannel)
            .not
            .toHaveBeenCalled();
          // eslint-disable-next-line no-console
          expect(console.error)
            .toHaveBeenCalled();
        });
    });

    it('should retry to connect', () => {
      config.get.mockImplementation((key) => {
        switch (key) {
          case 'rabbitmq.host': return 'the.host';
          case 'rabbitmq.port': return 3030;
          case 'rabbitmq.user': return 'the_user';
          case 'rabbitmq.password': return 'the_password';
          case 'rabbitmq.retry.max_retry': return 5;
          case 'rabbitmq.retry.interval': return 1000;
          default: return '';
        }
      });

      format.mockImplementation(() => 'amqp://the_user:the_password@the_host:3030');

      connection.createChannel.mockImplementationOnce((callback) => {
        callback(null, channel);
      });

      channel.consume.mockImplementationOnce((queue, callback) => {
        callback('the_message');
      });

      amqp.connect.mockImplementationOnce((param, callback) => {
        callback(Error('Connection failed'));
      });
      amqp.connect.mockImplementationOnce((param, callback) => {
        callback(null, connection);
      });

      const promise = rabbit.consume('test_exchange', 'test_queue', jest.fn());

      jest.runAllTimers();

      return promise
        .then(() => {
          expect(setTimeout.mock.calls[0][1])
            .toBe(1000);
          expect(amqp.connect)
            .toHaveBeenCalledTimes(2);
          expect(connection.createChannel)
            .toHaveBeenCalledTimes(1);
          expect(config.get)
            .toHaveBeenCalledTimes(10);
        });
    });

    it('should not reconnect if a connection is already open', () => {
      config.get.mockImplementation((key) => {
        switch (key) {
          case 'rabbitmq.host': return 'the.host';
          case 'rabbitmq.port': return 3030;
          case 'rabbitmq.user': return 'the_user';
          case 'rabbitmq.password': return 'the_password';
          case 'rabbitmq.retry.max_retry': return 1;
          case 'rabbitmq.retry.interval': return 1000;
          default: return '';
        }
      });

      format.mockImplementationOnce(() => 'amqp://the_user:the_password@the_host:3030');

      connection.createChannel.mockImplementationOnce((callback) => {
        callback(null, channel);
      });

      return rabbit.consume('test_exchange', 'test_queue', jest.fn())
        .then(() => {
          expect(amqp.connect)
            .not
            .toHaveBeenCalled();
          expect(connection.createChannel)
            .toHaveBeenCalled();
        });
    });
  });

  describe('.consume()', () => {
    beforeEach(() => {
      config.get.mockImplementationOnce(() => 'the.host');
      config.get.mockImplementationOnce(() => 3030);
      config.get.mockImplementationOnce(() => 'the_user');
      config.get.mockImplementationOnce(() => 'the_password');

      format.mockImplementationOnce(() => 'amqp://the_user:the_password@the_host:3030');

      amqp.connect.mockImplementationOnce((param, callback) => {
        callback(null, connection);
      });
    });

    it('should call the callback on success', () => {
      const consumer = jest.fn();

      connection.createChannel.mockImplementationOnce((callback) => {
        callback(null, channel);
      });
      channel.assertQueue.mockImplementationOnce((queue, options, callback) => {
        callback(null, { queue: 'the_queue' });
      });
      channel.consume.mockImplementationOnce((queue, callback) => {
        callback('the_message');
      });

      return rabbit.consume('test_exchange', 'test_queue', consumer)
        .then(() => {
          expect(connection.createChannel)
            .toHaveBeenCalled();

          expect(channel.prefetch)
            .toHaveBeenCalledWith(10);
          expect(channel.assertExchange)
            .toHaveBeenCalledWith('test_exchange', 'direct', { durable: true });
          expect(channel.assertQueue)
            .toHaveBeenCalledWith('test_queue', {}, expect.any(Function));
          expect(channel.bindQueue)
            .toHaveBeenCalledWith('the_queue', 'test_exchange', 'test_queue');
          expect(channel.consume)
            .toHaveBeenCalledWith('the_queue', expect.any(Function));

          expect(consumer)
            .toHaveBeenCalledWith(channel, 'the_message');
        });
    });

    it('should log an error when queue creation fails', () => {
      const consumer = jest.fn(() => Promise.reject(Error('Should not have been called')));

      connection.createChannel.mockImplementationOnce((callback) => {
        callback(null, channel);
      });
      channel.assertQueue.mockImplementationOnce((queue, options, callback) => {
        callback(Error('queue creation error'), { queue: 'the_queue' });
      });
      // eslint-disable-next-line no-console
      console.error = jest.fn();

      return rabbit.consume('test_exchange', 'test_queue', consumer)
        .then(() => {
          expect(connection.createChannel)
            .toHaveBeenCalled();

          expect(channel.prefetch)
            .toHaveBeenCalledWith(10);
          expect(channel.assertExchange)
            .toHaveBeenCalledWith('test_exchange', 'direct', { durable: true });
          expect(channel.close)
            .toHaveBeenCalled();

          // eslint-disable-next-line no-console
          expect(console.error)
            .toHaveBeenCalledWith(Error('queue creation error'));
        });
    });

    it('should log an error when channel creation fails', () => {
      const consumer = jest.fn(() => Promise.reject('Should not have been called'));

      // eslint-disable-next-line no-console
      console.error = jest.fn();

      connection.createChannel.mockImplementationOnce((callback) => {
        callback(Error('Channel creation error'));
      });

      return rabbit.consume('test_exchange', 'test_queue', consumer)
        .then(() => {
          expect(connection.createChannel)
            .toHaveBeenCalled();

          // eslint-disable-next-line no-console
          expect(console.error)
            .toHaveBeenCalledWith(Error('Channel creation error'));
        });
    });
  });

  describe('.producer()', () => {
    beforeEach(() => {
      config.get.mockImplementationOnce(() => 'the.host');
      config.get.mockImplementationOnce(() => 3030);
      config.get.mockImplementationOnce(() => 'the_user');
      config.get.mockImplementationOnce(() => 'the_password');

      format.mockImplementationOnce(() => 'amqp://the_user:the_password@the_host:3030');

      amqp.connect.mockImplementationOnce((param, callback) => {
        callback(null, connection);
      });
    });

    it('should publish the message', () => {
      connection.createChannel.mockImplementationOnce((callback) => {
        callback(null, channel);
      });

      return rabbit.produce('test_exchange', 'test_queue', 'the_message')
        .then(() => {
          expect(channel.assertExchange)
            .toHaveBeenCalledWith('test_exchange', 'direct', { durable: true });
          expect(channel.publish)
            .toHaveBeenCalledWith('test_exchange', 'test_queue', new Buffer('the_message'));
          expect(channel.close)
            .toHaveBeenCalled();
        });
    });

    it('should log an error when channel creation fails', () => {
      // eslint-disable-next-line no-console
      console.error = jest.fn();

      connection.createChannel.mockImplementationOnce((callback) => {
        callback(Error('Channel creation error'));
      });

      return rabbit.produce('test_exchange', 'test_queue', 'the_message')
        .then(() => {
          expect(connection.createChannel)
            .toHaveBeenCalled();

          // eslint-disable-next-line no-console
          expect(console.error)
            .toHaveBeenCalledWith(Error('Channel creation error'));
        });
    });
  });
});
