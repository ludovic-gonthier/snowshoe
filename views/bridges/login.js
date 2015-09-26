'use strict';

var React = require('react');

var LoginJumbotron = React.createFactory(require('../components/login-jumbotron.jsx'));

console.log(document.getElementById('mount-login-jumbotron'));
React.render(new LoginJumbotron(), document.getElementById("mount-login-jumbotron"));
