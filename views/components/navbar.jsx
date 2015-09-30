'use strict';

var React = require('react');
var io = require('socket.io-client');

var Dropdown = {
  Teams: require('./dropdowns/teams.jsx'),
  Organizations: require('./dropdowns/organizations.jsx')
};

module.exports = React.createClass({
  render: function () {
    return (
      <span>
        <ul className="nav navbar-nav">
          {this.props.hasUser &&
            <li>
              <a href="/user/personal/">My Repositories</a>
            </li>
          }
          {this.props.hasUser &&
            <li>
              <a href="/user/contributing/">Contributing to</a>
            </li>
          }
          <Dropdown.Organizations />
          <Dropdown.Teams hasUser={this.props.hasUser} accessToken={this.props.accessToken} />
        </ul>
      </span>
    );
  }
});
