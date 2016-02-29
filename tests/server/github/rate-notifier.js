/* global describe, expect, it, proxyquire, ROOT_PATH, sinon */
/* eslint-disable no-unused-expressions */
import Promise from 'promise';

import notifier from '../../../server/github/rate-notifier';
import fixtures from '../../fixtures/server/github/rate-notifier.json';

describe('rate-notifier', () => {
  describe('.notify()', () => {
    it('should send the rate informations to the socket', () => {
      const socket = {
        emit: sinon.stub(),
      };
      const notify = notifier(socket);

      return new Promise((resolve, reject) => {
        notify(fixtures.complete_headers)
          .then(data => {
            expect(data).to.eql(fixtures.complete_headers);
            expect(socket.emit).to.have.been.calledWith('rate', {
              limit: fixtures.complete_headers.headers['x-ratelimit-limit'],
              remaining: fixtures.complete_headers.headers['x-ratelimit-remaining'],
              reset: fixtures.complete_headers.headers['x-ratelimit-reset'],
            });
            resolve();
          })
          .catch(reject);
      });
    });
    it('should send no informations if missing one header key', () => {
      const socket = {
        emit: sinon.stub(),
      };
      const notify = notifier(socket);

      return new Promise((resolve, reject) => {
        notify(fixtures.missing_headers)
          .then(data => {
            expect(data).to.eql(fixtures.missing_headers);
            expect(socket.emit).to.have.not.been.called;
            resolve();
          })
          .catch(reject);
      });
    });
  });
});
