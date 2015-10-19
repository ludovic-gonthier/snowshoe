'use strict';

var React = require('react');
var io = require('socket.io-client');

var Dropdown = {
  Teams: require('./dropdowns/teams.jsx'),
  Organizations: require('./dropdowns/organizations.jsx'),
  User: require('./dropdowns/user.jsx'),
};

module.exports = React.createClass({
  render: function () {
    return (
      <span>
        <ul className="nav navbar-nav">
          {this.props.user &&
            <Dropdown.User user={this.props.user}/>
          }
          <Dropdown.Organizations />
          <Dropdown.Teams hasUser={!!this.props.user} accessToken={this.props.accessToken} />
        </ul>
      </span>
    );
  }
});
