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
      teams: []
    };
  },
  componentDidMount: function () {
    var socket = this.socket();

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
  formatDate: function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    return <strong>{hours}:{minutes}</strong>;
  },
  computeRateCssColor: function(remaining, limit)
  {
    var percent = (remaining * 100) / limit;

    if (percent <= 10) {
      return "label-error";
    }

    if (percent <= 35) {
      return 'label-warning'
    }

    return 'label-info';
  },
  render: function () {
    var labelClass;

    if (this.state.rate) {
      labelClass = "label " + this.computeRateCssColor(this.state.rate.remaining, this.state.rate.limit);
    }

    return (
      <div className="col-lg-8 colg-lg-offset-1">
        <p className="navbar-text">PR to watch : </p>
        <div className="btn-group pull-left" role="group">
          <button type="button" className="btn btn-default navbar-btn" onClick={this.fetchPersonalPulls}>Personal</button>

          <Navbar.Teams teams={this.state.teams}/>
        </div>
        {!this.state.rate ? '' :
        <span className="navbar-text">
          Rate : <span className={labelClass}>{this.state.rate.remaining}/{this.state.rate.limit}</span>
        </span>
        }
        {!this.state.rate ? '' :
        <span className="navbar-text">
          Reset at : {this.formatDate(this.state.rate.reset)}
        </span>
        }
      </div>
    );
  }
});

Navbar.Teams = React.createClass({
  render: function () {
    var dropdown = <li><a>Loading...</a></li>;

    if (this.props.teams.length != 0) {
      dropdown = this.props.teams.map(function (team, index) {
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
