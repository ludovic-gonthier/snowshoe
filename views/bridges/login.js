'use strict';

var React = require('react');

var LoginJumbotron = React.createFactory(require('../components/login-jumbotron.jsx'));

React.render(new LoginJumbotron(), document.getElementById("mount-login-jumbotron"));
