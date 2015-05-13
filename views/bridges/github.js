'use strict';

var React = require('react');
var cookie = require('cookie');

var Github = React.createFactory(require('../components/github.jsx'));
var Header = React.createFactory(require('../components/header.jsx'));

var locals = JSON.parse(cookie.parse(document.cookie).locals);

// Remove the consumed cookie
document.cookie = cookie.serialize('locals', '', {
  expires: new Date(0)
});

React.render(new Github(locals), document.getElementById("mount-github"));
React.render(new Header(locals), document.getElementById("mount-header"));
