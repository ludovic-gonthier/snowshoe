'use strict';

var config = require('config');
var http = require('http');
var io = require('socket.io');

var app = require('./app');
var listener = require('./lib/socket/listener');

var server = http.createServer(app);
module.exports.server = server;

var socket = io(server);
module.exports.io = socket;

/*
 * Server part
 */
server.on('listening', function () {
  var separator = new Array(81).join('=');

  console.log("%s\n", separator);
  console.log('Server launched.');
  console.log("\nInformations:\n\tHostname: %s\n\tPort: %s\n", server.address().address, server.address().port);
  console.log(separator);
});

server.listen(
  process.env.PORT || config.get('server.port'),
  process.env.ADRESS || config.get('server.hostname')
);

/*
 * Socket part
 */
socket.on('connection', listener);
