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

      <li className="dropdown">
        <a href="#" className="dropdown-toggle btn" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" {...attributes}>
          Organizations
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
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
      </li>
    )
  }
});
