/* global beforeEach, describe, expect, it, proxyquire, ROOT_PATH, sinon */
/* eslint-disable no-unused-expressions */
import fixtures from '../../fixtures/common/github/rate-notifier.json';

const stubs = {
  produce: sinon.stub(),
};

const {
  notifier,
} = proxyquire(`${ROOT_PATH}/common/github/rate-notifier`, {
  lodash: { curry: () => () => stubs.produce },
});

describe('rate-notifier', () => {
  beforeEach(() => stubs.produce.reset());

  describe('.notifier()', () => {
    it('should send the rate informations to the socket', () => {
      const data = notifier('test_token', fixtures.complete_headers);

      expect(data).to.eql(fixtures.complete_headers);
      expect(stubs.produce).to.have.been.calledWith(
        JSON.stringify({
          type: 'rate',
          token: 'test_token',
          data: {
            limit: fixtures.complete_headers.headers['x-ratelimit-limit'],
            remaining: fixtures.complete_headers.headers['x-ratelimit-remaining'],
            reset: fixtures.complete_headers.headers['x-ratelimit-reset'],
          },
        })
      );
    });
    it('should send no informations if missing one header key', () => {
      notifier('test_token', fixtures.missing_headers);

      expect(stubs.produce).to.not.be.called;
    });
  });
});
