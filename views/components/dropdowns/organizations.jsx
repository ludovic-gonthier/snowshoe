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
      console.log(data);
      this.setState({organizations: data});
    }.bind(this));
  },
  loadTeams: function (organizationLogin) {
    console.log('loadTeams');
    console.log('organizationLogin %s', organizationLogin);

    // this.socket().emit('team', organizationLogin);
  },
  render: function () {
    return (
      <div className="btn-group" role="group">
        <button type="button" className="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown" data-loading-text="Loading...">
          Organizations  <span className="caret"/>
        </button>
          <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            {this.state.organizations.length == 0 ? <li><a>Loading...</a></li> :
              this.state.organizations.map(function (organization, index) {
                return (
                  <li role="presentation" key={index}>
                    <span role="menuitem" onClick={this.loadTeams.bind(this, organization.login)}>{organization.login}</span>
                  </li>
                );
              }.bind(this))
            }
          </ul>
      </div>
    )
  }
});
