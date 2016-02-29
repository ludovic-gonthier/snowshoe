import chai, { expect } from 'chai';
import path from 'path';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import sinonchai from 'sinon-chai';

chai.use(sinonchai);

global.chai = chai;
global.expect = expect;
global.sinon = sinon;
global.proxyquire = proxyquire;
global.ROOT_PATH = path.resolve(__dirname, '..');
