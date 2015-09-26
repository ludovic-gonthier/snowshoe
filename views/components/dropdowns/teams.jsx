'use strict';

var React = require('react');
var io = require('socket.io-client');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      teams: []
    };
  },
  componentDidMount: function () {
    io().on('teams', function (data) {
      this.setState({teams: data});
    }.bind(this));
  },
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
    var attributes = {};

    if (this.state.teams.length === 0) {
      attributes.disabled = 'disabled';
    }

    return (
      <li className="dropdown">
        <a href="#"
           className="btn dropdown-toggle"
           data-toggle="dropdown"
           role="button"
           aria-haspopup="true"
           aria-expanded="false"
           {...attributes}>
          Teams
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          {this.buildDropdown()}
        </ul>
      </li>
    );
  }
});
