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
    var dropdown = <li><a>Loading...</a></li>;

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
      <div className="btn-group" role="group">
        <button type="button" className="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown" data-loading-text="Loading...">
          Teams  <span className="caret"/>
        </button>
        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          {dropdown}
        </ul>
      </div>
    )
  }
});
