import rabbit from '../../common/rabbit';
import organizationsConsumer from '../../worker/consumers/organizations-consumer';
import pullsConsumer from '../../worker/consumers/pulls-consumer';
import teamsConsumer from '../../worker/consumers/teams-consumer';

import worker from '../../worker';

jest.mock('../../common/rabbit', () => ({
  consume: jest.fn(),
}));
jest.mock('../../worker/consumers/organizations-consumer', () => jest.fn());
jest.mock('../../worker/consumers/pulls-consumer', () => jest.fn());
jest.mock('../../worker/consumers/teams-consumer', () => jest.fn());

const channel = {
  ack: jest.fn(),
  nack: jest.fn(),
};

describe('Workers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should log an error if the message type is incorrect', () => {
    const message = {
      content: JSON.stringify({
        type: 'unknown',
        data: {},
        token: '12345',
      }),
    };

    /* eslint-disable no-console */
    console.error = jest.fn();
    console.error.mockImplementationOnce(() => {});
    /* eslint-enable no-console */

    return new Promise((resolve) => {
      rabbit.consume.mockImplementationOnce((exchange, queue, callback) => {
        callback(channel, message);

        // eslint-disable-next-line no-console
        expect(console.error)
          .toHaveBeenCalled();
        resolve();
      });

      worker();
    });
  });

  it('should acknowledge an organizations message', () => {
    const token = '12345';
    const data = {};
    const message = {
      content: JSON.stringify({
        type: 'organizations',
        data,
        token,
      }),
    };

    organizationsConsumer.mockImplementationOnce(() => Promise.resolve());

    return new Promise((resolve, reject) => {
      rabbit.consume.mockImplementationOnce((exchange, queue, callback) => {
        callback(channel, message)
          .then(() => {
            expect(organizationsConsumer)
              .toHaveBeenCalledWith(token, data);
            expect(channel.ack)
              .toHaveBeenCalledWith(message);

            resolve();
          })
          .catch(reject);
      });

      worker();
    });
  });

  it('should acknowledge a pulls message', () => {
    const token = '12345';
    const data = {};
    const message = {
      content: JSON.stringify({
        type: 'pulls',
        data,
        token,
      }),
    };

    pullsConsumer.mockImplementationOnce(() => Promise.resolve());

    return new Promise((resolve, reject) => {
      rabbit.consume.mockImplementationOnce((exchange, queue, callback) => {
        callback(channel, message)
          .then(() => {
            expect(pullsConsumer)
              .toHaveBeenCalledWith(token, data);
            expect(channel.ack)
              .toHaveBeenCalledWith(message);

            resolve();
          })
          .catch(reject);
      });

      worker();
    });
  });

  it('should acknowledge a teams message', () => {
    const token = '12345';
    const data = {};
    const message = {
      content: JSON.stringify({
        type: 'teams',
        data,
        token,
      }),
    };

    teamsConsumer.mockImplementationOnce(() => Promise.resolve());

    return new Promise((resolve, reject) => {
      rabbit.consume.mockImplementationOnce((exchange, queue, callback) => {
        callback(channel, message)
          .then(() => {
            expect(teamsConsumer)
              .toHaveBeenCalledWith(token, data);
            expect(channel.ack)
              .toHaveBeenCalledWith(message);

            resolve();
          })
          .catch(reject);
      });

      worker();
    });
  });

  it('should reject when consumers return a rejected Promise', () => {
    const token = '12345';
    const data = {};
    const message = {
      content: JSON.stringify({
        type: 'organizations',
        data,
        token,
      }),
    };

    /* eslint-disable no-console */
    console.error = jest.fn();
    console.error.mockImplementationOnce(() => {});
    /* eslint-enable no-console */

    organizationsConsumer.mockImplementationOnce(() => Promise.reject(Error('message rejected')));

    return new Promise((resolve, reject) => {
      rabbit.consume.mockImplementationOnce((exchange, queue, callback) => {
        callback(channel, message)
          .then(() => {
            expect(organizationsConsumer)
              .toHaveBeenCalledWith(token, data);
            // eslint-disable-next-line no-console
            expect(console.error)
              .toHaveBeenCalled();
            expect(channel.nack)
              .toHaveBeenCalledWith(message, false, false);

            resolve();
          })
          .catch(reject);
      });

      worker();
    });
  });
});

