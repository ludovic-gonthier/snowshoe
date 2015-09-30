'use strict';

var Promise = require('promise');

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
  this.timeout = null;
  this.delay = delay;
  this.callback = null;
  this.started = false;
};

/**
 * Starts the polling for all registered object
 */
Poller.prototype.start = function () {
  this.processing = false;
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
  var executors;

  if (this.processing) {
    return;
  }

  this.processing = true;
  executors = this.registered.map(function registeredForEachCallback(item) {
    return this.callback(item.data, item.socket);
  }, this);

  Promise.all(executors)
    .catch(console.error.bind(console))
    .done(function () {
      this.processing = false;
    }.bind(this));
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
