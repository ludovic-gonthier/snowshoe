/* global beforeEach, describe, expect, it, sinon */
/* eslint-disable no-unused-expressions */
import { default as Poller } from '../../server/poller';

describe('poller', () => {
  describe('.start()', () => {
    it('should start the polling', done => {
      const poller = new Poller(1);

      poller.registered = [
        { data: 42, socket: 45 },
      ];

      poller.callback = () => {
        clearInterval(poller.interval);
        expect(poller.started).to.be.true;

        done();
      };
      poller.start();
    });
  });
  describe('.stop()', () => {
    it('should stop the polling', () => {
      const poller = new Poller(10);
      poller.started = true;

      poller.callback = sinon.stub();
      poller.stop();

      expect(poller.started).to.be.false;
    });
  });
  describe('.execute()', () => {
    it('should execute the callback', () => {
      const poller = new Poller(10);

      poller.registered = [
        { data: 42, socket: 45 },
        { data: 1337, socket: 2 },
      ];

      poller.callback = sinon.stub();
      poller.execute();
      clearInterval(poller.interval);

      expect(poller.callback).to.be.calledTwice;
    });
  });
  describe('.register()', () => {
    it('should register the socket', () => {
      const poller = new Poller(10);

      poller.callback = sinon.stub();
      poller.register(42, 45);
      clearInterval(poller.interval);

      expect(poller.registered).to.eql([{ data: 42, socket: 45 }]);
    });
    it('should start the polling if more than 0 registered elements', () => {
      const poller = new Poller(10);

      poller.callback = sinon.stub();
      poller.register(42, 45);
      clearInterval(poller.interval);

      expect(poller.started).to.be.true;
    });
  });
  describe('.unregister()', () => {
    it('should unregister the socket', () => {
      const poller = new Poller(10);

      poller.registered = [
        { data: 42, socket: 45 },
        { data: 1337, socket: 2 },
      ];

      poller.callback = sinon.stub();
      poller.unregister(45);
      clearInterval(poller.interval);

      expect(poller.registered).to.eql([{ data: 1337, socket: 2 }]);
    });
    it('should stop the polling if 0 registered elements', () => {
      const poller = new Poller(10);

      poller.registered = [
        { data: 42, socket: 45 },
      ];

      poller.callback = sinon.stub();
      poller.unregister(45);
      clearInterval(poller.interval);

      expect(poller.registered).to.eql([]);
      expect(poller.started).to.be.false;
    });
  });
});
