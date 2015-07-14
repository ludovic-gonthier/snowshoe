'use strict';

var http = require('http');
var io = require('socket.io');

var app = require('./app');
var listener = require('./lib/socket/listener');

var server = http.createServer(app);
var socket = io(server);

module.exports.server = server;
module.exports.io = socket;

/*
 * Server part
 */
server.on('listening', function () {
  var separator = new Array(81).join('=');

  /*eslint-disable quotes, no-console */

  console.log("%s\n", separator);
  console.log('Server launched.');
  console.log(
    "\nInformations:\n\tHostname: %s\n\tPort: %s\n",
    server.address().address,
    server.address().port
  );
  console.log(separator);

  /*eslint-enable quotes, no-console */
});

server.listen(
  process.env.PORT || 3000,
  process.env.SNOWSHOE_HOSTNAME || '127.0.0.1'
);

/*
 * Socket part
 */
socket.on('connection', listener);
