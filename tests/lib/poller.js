'use strict';

var Poller = require(ROOT_PATH + '/lib/poller');

describe('poller', function () {
  describe('#start', function () {
    it('should start the polling', function (done) {
      var poller = new Poller(1);

      poller.callback = sinon.stub();
      poller.start();

      setTimeout(function () {
        clearInterval(poller.interval);

        expect(poller.callback).to.be.called;
        expect(poller.started).to.be.true;

        done();
      });
    });
  });
  describe('#stop', function () {
    it('should stop the polling', function () {
      var poller = new Poller(10);
      poller.started = true;

      poller.callback = sinon.stub();
      poller.stop();

      expect(poller.started).to.be.false;
    });
  });
  describe('#execute', function () {
    it('should execute the callback', function () {
      var poller = new Poller(10);

      poller.registered = [
        {data: 42, socket: 45},
        {data: 1337, socket: 2}
      ];

      poller.callback = sinon.stub();
      poller.execute();
      clearInterval(poller.interval);

      expect(poller.callback).to.be.calledTwice;
    });
  });
  describe('#register', function () {
    it('should register the socket', function () {
      var poller = new Poller(10);

      poller.callback = sinon.stub();
      poller.register(42, 45);
      clearInterval(poller.interval);

      expect(poller.registered).to.eql([{data: 42, socket: 45}]);
    });
    it('should start the polling if more than 0 registered elements', function () {
      var poller = new Poller(10);

      poller.callback = sinon.stub();
      poller.register(42, 45);
      clearInterval(poller.interval);

      expect(poller.started).to.be.true;
    });
  });
  describe('#unregister', function () {
    it('should unregister the socket', function () {
      var poller = new Poller(10);

      poller.registered = [
        {data: 42, socket: 45},
        {data: 1337, socket: 2}
      ];

      poller.callback = sinon.stub();
      poller.unregister(45);
      clearInterval(poller.interval);

      expect(poller.registered).to.eql([{data: 1337, socket: 2}]);
    });
    it('should stop the polling if 0 registered elements', function () {
      var poller = new Poller(10);

      poller.registered = [
        {data: 42, socket: 45}
      ];

      poller.callback = sinon.stub();
      poller.unregister(45);
      clearInterval(poller.interval);

      expect(poller.registered).to.eql([]);
      expect(poller.started).to.be.false;
    });
  });
});
