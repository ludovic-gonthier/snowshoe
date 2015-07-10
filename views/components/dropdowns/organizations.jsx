'use strict';

var React = require('react');
var io = require('socket.io-client');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      organizations: [],
    };
  },
  componentDidMount: function () {
    io().on('organizations', function (data) {
      this.setState({organizations: data});
    }.bind(this));
  },
  loadTeams: function (organizationLogin) {
    io().emit('team', organizationLogin);
  },
  render: function () {
    var attributes = {};

    if (this.state.organizations.length === 0) {
      attributes['disabled'] = 'disabled';
    }

    return (
      <div id="organizations-dropdown" className="btn-group" role="group">
        <button type="button" className="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown" {...attributes}>
          Organizations  <span className="caret"/>
        </button>
          <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            {this.state.organizations.length == 0 ? null :
              this.state.organizations.map(function (organization, index) {
                return (
                  <li role="presentation" key={index}>
                    <a role="menuitem" onClick={this.loadTeams.bind(this, organization.login)}>{organization.login}</a>
                  </li>
                );
              }.bind(this))
            }
          </ul>
      </div>
    )
  }
});
