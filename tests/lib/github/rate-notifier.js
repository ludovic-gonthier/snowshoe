'use strict';

var Promise = require('promise');

var notifier = require(ROOT_PATH + '/lib/github/rate-notifier');
var fixtures = require(ROOT_PATH + '/tests/fixtures/lib/github/rate-notifier.json');

describe('rate-notifier', function () {
  describe('.notify()', function () {
    it('should send the rate informations to the socket', function () {
      var socket = {
        emit: sinon.stub()
      };
      var notify = notifier(socket);

      return new Promise(function (resolve, reject) {
        notify(fixtures.complete_headers)
          .then(function (data) {
            expect(data).to.eql(fixtures.complete_headers);
            expect(socket.emit).to.have.been.calledWith('rate', {
              'limit': fixtures.complete_headers.headers['x-ratelimit-limit'],
              'remaining': fixtures.complete_headers.headers['x-ratelimit-remaining'],
              'reset': fixtures.complete_headers.headers['x-ratelimit-reset']
            });
            resolve();
          })
          .catch(reject);
      });
    });
    it('should send no informations if missing one header key', function () {
      var socket = {
        emit: sinon.stub()
      };
      var notify = notifier(socket);

      return new Promise(function (resolve, reject) {
        notify(fixtures.missing_headers)
          .then(function (data) {
            expect(data).to.eql(fixtures.missing_headers);
            expect(socket.emit).to.have.not.been.called;
            resolve();
          })
          .catch(reject);
      });
    });
  });
});
