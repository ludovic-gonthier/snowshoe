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
    let executors;

    if (this.processing) {
      return;
    }

    this.processing = true;
    executors = this.registered.map((item) => this.callback(item.data, item.socket));

    Promise.all(executors)
      .catch(console.error.bind(console)) // eslint-disable-line no-console
      .done(() => {
        this.processing = false;
      });
  }

  register(data, socket) {
    // Register the socket
    this.registered.push({
      data,
      socket,
    });

    if (!this.started) {
      this.start();
    }
  }

  unregister(socket) {
    // Unregister the socket
    this.registered = this.registered.filter((item) => (socket !== item.socket));

    if (this.registered.length === 0) {
      this.stop();
    }
  }
}
