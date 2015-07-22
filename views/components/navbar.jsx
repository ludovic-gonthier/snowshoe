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
    var personnalButton = '';

    if (this.props.hasUser) {
      personnalButton = (
        <li>
          <a href="#" onClick={this.fetchPersonalPulls}>Personal</a>
        </li>
      );
    }

    return (
      <span>
        <ul className="nav navbar-nav">
          {personnalButton}
          <Dropdown.Organizations />
          <Dropdown.Teams accessToken={this.props.accessToken} />
        </ul>
      </span>
    );
  }
});
