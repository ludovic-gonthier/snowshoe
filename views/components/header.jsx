'use strict';

var React = require('react');
var io = require('socket.io-client');

var mixin = {
  socket: function () {
    return io();
  }
};

var Navbar = React.createClass({
  mixins: [mixin],
  getInitialState: function () {
    return {
      organizations: [],
      teams: []
    };
  },
  componentDidMount: function () {
    var socket = this.socket();

    socket.on('organizations', function (data) {
      this.setState({organizations: data});
    }.bind(this));

    socket.on('teams', function (data) {
      this.setState({teams: data});
    }.bind(this));

    socket.on('rate', function (data) {
      data.reset = new Date(data.reset  * 1000);
      this.setState({rate: data});
    }.bind(this));
  },
  fetchPersonalPulls: function () {
    this.socket().emit('pulls');
  },
  render: function () {
    return (
      <div className="col-lg-8 colg-lg-offset-1">
        <p className="navbar-text">PR to watch : </p>
        <div className="btn-group pull-left" role="group">
          <button type="button" className="btn btn-default navbar-btn" onClick={this.fetchPersonalPulls}>Personal</button>

          <Navbar.Organizations organizations={this.state.organizations}/>
          <Navbar.Teams teams={this.state.teams}/>
        </div>
        {!this.state.rate ? '' :
        <span className="navbar-text">
          Rate : <span className="label label-info">{this.state.rate.remaining}/{this.state.rate.limit}</span>
        </span>
        }
        {!this.state.rate ? '' :
        <span className="navbar-text">
          Reset at : <strong>{this.state.rate.reset.getHours()}:{this.state.rate.reset.getMinutes()}</strong>
        </span>
        }
      </div>
    );
  }
});

Navbar.Organizations = React.createClass({
  render: function () {
    return (
      <div className="btn-group" role="group">
        <button type="button" className="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown" data-loading-text="Loading...">
          Organizations  <span className="caret"/>
        </button>
          <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            {this.props.organizations.length == 0 ? <li><a>Loading...</a></li> :
              this.props.organizations.map(function (organization, index) {
                return (
                  <Navbar.ListElement key={index} repositories={organization.repos_url}>{organization.login}</Navbar.ListElement>
                );
              })
            }
          </ul>
      </div>
    )
  }
});

Navbar.Teams = React.createClass({
  render: function () {
    return (
      <div className="btn-group" role="group">
        <button type="button" className="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown" data-loading-text="Loading...">
          Teams  <span className="caret"/>
        </button>
          <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            {this.props.teams.length == 0 ? <li><a>Loading...</a></li> :
              this.props.teams.map(function (team, index) {
                return (
                  <Navbar.ListElement key={index} repositories={team.repositories_url}>{team.name}</Navbar.ListElement>
                );
              })
            }
          </ul>
      </div>
    )
  }
});

Navbar.ListElement = React.createClass({
  mixins: [mixin],
  handleClick: function (event) {
    event.preventDefault();

    this.socket().emit('pulls', this.props.repositories);
  },
  render: function () {
    return (
      <li role="presentation">
        <a role="menuitem" onClick={this.handleClick}>{this.props.children}</a>
      </li>
    );
  }
});

var Header = React.createClass({
  render: function () {
    return (
      <header className="navbar navbar-default">
        <div className="container">
          <a href="/" className="navbar-brand col-lg-2">SnowShoe</a>

          {this.props.authenticated ? <Navbar /> : ''}

          <Header.AuthenticationButton authenticated={this.props.authenticated}/>
        </div>
      </header>
    );
  }
});

Header.AuthenticationButton = React.createClass({
  render: function () {
    var label = this.props.authenticated ? 'Log Out' : 'Log In';
    var href = this.props.authenticated ? '/logout' : '/auth/github';
    var classes;

    if (this.props.authenticated) {
      classes = ['btn', 'navbar-btn', 'col-lg-1', 'col-lg-offset-1', 'btn-primary'];
    } else {
      classes = ['btn', 'navbar-btn', 'col-lg-1', 'col-lg-offset-9', 'btn-success'];
    }

    return (
      <a href={href} className={classes.join(' ')}>{label}</a>
    );
  }
});

module.exports = Header;
