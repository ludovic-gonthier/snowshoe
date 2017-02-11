import Poller from '../../server/poller';

describe('poller', () => {
  describe('.start()', () => {
    it('should start the polling', () => {
      const poller = new Poller(1);

      poller.registered = [
        { token: 42 },
      ];

      return new Promise((resolve) => {
        poller.callback = () => {
          clearInterval(poller.interval);
          expect(poller.started).toBe(true);

          resolve();
        };
        poller.start();
      });
    });
  });
  describe('.stop()', () => {
    it('should stop the polling', () => {
      const poller = new Poller(10);
      poller.started = true;

      poller.callback = jest.fn();
      poller.stop();

      expect(poller.started).toBe(false);
    });
  });
  describe('.execute()', () => {
    it('should do nothing if still processing', () => {
      const poller = new Poller(10);

      poller.registered = [
        { token: 42 },
        { token: 1337 },
      ];
      poller.processing = true;

      poller.callback = jest.fn();
      poller.execute();
      clearInterval(poller.interval);

      expect(poller.callback)
        .not
        .toHaveBeenCalled();
    });

    it('should execute the callback', () => {
      const poller = new Poller(10);

      poller.registered = [
        { token: 42 },
        { token: 1337 },
      ];

      poller.callback = jest.fn();
      poller.execute();
      clearInterval(poller.interval);

      expect(poller.callback)
        .toHaveBeenCalledTimes(2);
    });
  });
  describe('.register()', () => {
    it('should register the socket', () => {
      const poller = new Poller(10);

      poller.callback = jest.fn();
      poller.register({ token: 42 });
      clearInterval(poller.interval);

      expect(poller.registered)
        .toEqual([{ token: 42 }]);
    });

    it('should start the polling if more than 0 registered elements', () => {
      const poller = new Poller(10);

      poller.callback = jest.fn();
      poller.register({ token: 42 });
      clearInterval(poller.interval);

      expect(poller.started)
        .toBe(true);
    });

    it('should not start the polling if already started', () => {
      const poller = new Poller(10);

      poller.started = true;
      poller.callback = jest.fn();
      poller.register({ token: 42 });

      expect(poller.interval)
        .toBe(null);

      clearInterval(poller.interval);
    });
  });
  describe('.unregister()', () => {
    it('should unregister the socket', () => {
      const poller = new Poller(10);

      poller.registered = [
        { token: 45 },
        { token: 1337 },
      ];

      poller.callback = jest.fn();
      poller.unregister(45);
      clearInterval(poller.interval);

      expect(poller.registered)
        .toEqual([{ token: 1337 }]);
    });
    it('should stop the polling if 0 registered elements', () => {
      const poller = new Poller(10);

      poller.registered = [
        { token: 42 },
      ];

      poller.callback = jest.fn();
      poller.unregister(42);
      clearInterval(poller.interval);

      expect(poller.registered)
        .toEqual([]);
      expect(poller.started)
        .toBe(false);
    });
  });
  describe('.has()', () => {
    it('returns true when the token is registered', () => {
      const poller = new Poller(10);

      poller.registered = [
        { token: 45 },
        { token: 1337 },
      ];

      const result = poller.has(1337);

      expect(result)
        .toBe(true);
    });

    it('returns false when the token is registered', () => {
      const poller = new Poller(10);

      poller.registered = [
        { token: 45 },
        { token: 1337 },
      ];

      const result = poller.has(137);

      expect(result)
        .toBe(false);
    });
  });
});
