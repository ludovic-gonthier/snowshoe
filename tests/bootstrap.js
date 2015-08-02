var path = require('path');

global.ROOT_PATH = path.resolve(__dirname, '..');

global.chai = require('chai');
global.expect = require('chai').expect;
global.sinon = require('sinon');

global.proxyquire = require('proxyquire');
