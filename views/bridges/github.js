'use strict';

var React = require('react');
var cookie = require('cookie');

var Dashboard = React.createFactory(require('../components/github/dashboard.jsx'));
var Header = React.createFactory(require('../components/header.jsx'));
var HomepageJumbotron = React.createFactory(require('../components/homepage-jumbotron.jsx'));

var locals = JSON.parse(cookie.parse(document.cookie).locals);

// Remove the consumed cookie
document.cookie = cookie.serialize('locals', '', {
  expires: new Date(0)
});

if (locals.isHomepage) {
  React.render(new HomepageJumbotron(), document.getElementById("mount-jumbotron"));
}

React.render(new Dashboard(locals), document.getElementById("mount-github"));
React.render(new Header(locals), document.getElementById("mount-header"));
