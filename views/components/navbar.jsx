'use strict';

var React = require('react');
var io = require('socket.io-client');

var Dropdown = {
  Teams: require('./dropdowns/teams.jsx'),
  Organizations: require('./dropdowns/organizations.jsx')
};

module.exports = React.createClass({
  fetchPersonalPulls: function () {
    io().emit('pulls');
  },
  render: function () {
    return (
      <span>
        <p className="navbar-text">PR to watch : </p>
        <ul className="nav navbar-nav">
          <li>
            <a href="#" onClick={this.fetchPersonalPulls}>Personal</a>
          </li>
          <Dropdown.Organizations />
          <Dropdown.Teams />
        </ul>
      </span>
    );
  }
});
