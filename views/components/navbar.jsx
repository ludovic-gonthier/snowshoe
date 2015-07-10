'use strict';

var React = require('react');
var io = require('socket.io-client');

var RateLimit = require('./github/rate-limit.jsx');

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
      <div className="col-lg-8 colg-lg-offset-1">
        <p className="navbar-text">PR to watch : </p>
        <div className="btn-group pull-left" role="group">
          <button type="button" className="btn btn-default navbar-btn" onClick={this.fetchPersonalPulls}>Personal</button>

          <Dropdown.Organizations />
          <Dropdown.Teams />
        </div>
        <RateLimit />
      </div>
    );
  }
});
