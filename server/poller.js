import Promise from 'promise';

export default class Poller {
  constructor(delay) {
    this.registered = [];
    this.timeout = null;
    this.delay = delay;
    this.callback = null;
    this.started = false;
  }

  start() {
    this.processing = false;
    this.interval = setInterval(this.execute.bind(this), this.delay);

    this.started = true;
  }

  stop() {
    clearInterval(this.interval);
    this.started = false;
  }

  execute() {
    if (this.processing) {
      return;
    }

    this.processing = true;

    Promise.all(this.registered.map(item => this.callback(item)))
      .catch(console.error.bind(console)) // eslint-disable-line no-console
      .done(() => {
        this.processing = false;
      });
  }

  register(data) {
    // Register the socket
    this.registered.push(data);

    if (!this.started) {
      this.start();
    }
  }

  has(token) {
    return !!this.registered.filter(register => register.token === token).length;
  }

  unregister(token) {
    // Unregister the socket
    this.registered = this.registered.filter(item => (token !== item.token));

    if (this.registered.length === 0) {
      this.stop();
    }
  }
}
