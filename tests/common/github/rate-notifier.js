/* global beforeEach, describe, expect, it, proxyquire, ROOT_PATH, sinon */
/* eslint-disable no-unused-expressions */
import fixtures from '../../fixtures/common/github/rate-notifier.json';

const stubs = {
  produce: sinon.stub(),
};

const rateNotifier = proxyquire(`${ROOT_PATH}/common/github/rate-notifier`, {
  lodash: { curry: () => () => stubs.produce },
}).default;

describe('rate-rateNotifier', () => {
  beforeEach(() => stubs.produce.reset());

  describe('.rateNotifier()', () => {
    it('should send the rate informations to the socket', () => {
      const data = rateNotifier('test_token', fixtures.complete_headers);

      expect(data).to.eql(fixtures.complete_headers);
      expect(stubs.produce).to.have.been.calledWith(
        JSON.stringify({
          action: {
            type: 'NOTIFY_RATE',
            rate: {
              limit: fixtures.complete_headers.headers['x-ratelimit-limit'],
              remaining: fixtures.complete_headers.headers['x-ratelimit-remaining'],
              reset: fixtures.complete_headers.headers['x-ratelimit-reset'],
            },
          },
          token: 'test_token',
        }),
      );
    });
    it('should send no informations if missing one header key', () => {
      const data = rateNotifier('test_token', fixtures.missing_headers);

      expect(data).to.eql(fixtures.missing_headers);
      expect(stubs.produce).to.not.be.called;
    });
  });
});
