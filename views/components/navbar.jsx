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
        <ul className="nav navbar-nav">
          {this.props.hasUser &&
            <li>
              <a href="#" onClick={this.fetchPersonalPulls}>My Repositories</a>
            </li>
          }
          <Dropdown.Organizations />
          <Dropdown.Teams hasUser={this.props.hasUser} accessToken={this.props.accessToken} />
        </ul>
      </span>
    );
  }
});
