'use strict';

var React = require('react');
var io = require('socket.io-client');

module.exports = React.createClass({
  buildDropdown: function () {
    if (this.state.teams.length === 0) {
      return null;
    }

    return this.state.teams.map(function (team, index) {
      var href = '/teams/' + team.slug + '/' + team.id;

      if (!this.props.hasUser && this.props.accessToken) {
        href += '?access_token=' + this.props.accessToken;
      }

      return (
        <li role="presentation" key={index}>
          <a role="menuitem" href={href}>{team.name}</a>
        </li>
      );
    }, this);
  },
  render: function () {
    return (
      <li className="dropdown">
        <a href="#"
           className="btn dropdown-toggle"
           data-toggle="dropdown"
           role="button"
           aria-haspopup="true"
           aria-expanded="false">
          {this.props.user.login}
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          <li>
            <a href="/user/personal/">My Repositories</a>
          </li>
          <li>
            <a href="/user/contributing/">Contributing to</a>
          </li>
        </ul>
      </li>
    );
  }
});
