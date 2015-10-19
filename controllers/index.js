'use strict';

var express = require('express');

module.exports.Router = new express.Router();

require('./firewall');

require('./homepage');
require('./pulls');

require('./authentification');

require('./error');
