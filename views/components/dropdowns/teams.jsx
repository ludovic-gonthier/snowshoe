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
  render: function () {
    var dropdown;

    if (this.state.teams.length != 0) {
      dropdown = this.state.teams.map(function (team, index) {
        var href = '/teams/' + team.slug + '/' + team.id;

        return (
          <li role="presentation" key={index}>
            <a role="menuitem" href={href}>{team.name}</a>
          </li>
        );
      });
    }

    return (
      <li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          Teams
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          {dropdown}
        </ul>
      </li>
    )
  }
});
