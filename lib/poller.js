'use strict';

module.exports = Poller;

/**
 * Poller constructor
 * @param {integer} delay Delay between two interval, in milliseconds
 */
function Poller(delay) {
  if (!(this instanceof Poller)) {
    return new Poller(delay);
  }

  this.registered = [];
  this.interval = null;
  this.delay = delay;
  this.callback = null;
};

/**
 * Starts the polling for all registered object
 */
Poller.prototype.start = function () {
  this.interval = setInterval(this.execute.bind(this), this.delay);
  this.started = true;
};

/**
 * Stop the polling
 */
Poller.prototype.stop = function () {
  clearInterval(this.interval);
  this.started = false;
};

/**
 * Callback for each poll tick
 */
Poller.prototype.execute = function () {
  this.registered.forEach(function registeredForEachCallback(item) {
    this.callback(item.data, item.socket);
  }, this);
};

/**
 * Registers a socket to the polling
 *
 * @param  {Object} data   A data Object containing informations
 *                         to fetch github api
 * @param  {Socket} socket A Socket instance
 */
Poller.prototype.register = function (data, socket) {
  // Register the socket
  this.registered.push({
    'data': data,
    'socket': socket
  });

  if (!this.started) {
    this.start();
  }
};

/**
 * Unregisters a socket to the polling
 *
 * @param  {Socket} socket A Socket instance
 */
Poller.prototype.unregister = function (socket) {
  // Unregister the socket
  this.registered = this.registered.filter(function unregisterFilterCallback(item) {
    return (socket !== item.socket);
  });

  if (this.registered.length === 0) {
    this.stop();
  }
};
