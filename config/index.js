'use strict';

var path = require('path');
var nconf = require('nconf');

var conf = new nconf.Provider();

module.exports = conf;

conf.argv()
  .env()
  .file('default', path.join(__dirname, '/config.json'));
