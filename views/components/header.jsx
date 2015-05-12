'use strict';

var React = require('react');

var Header = React.createClass({
  render: function () {
    return (
      <header className="navbar navbar-default">
        <div className="container">
          <a href="/" className="navbar-brand col-lg-2">SnowShoe</a>

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
      classes = ['btn', 'navbar-btn', 'col-lg-1', 'col-lg-offset-2', 'btn-primary'];
    } else {
      classes = ['btn', 'navbar-btn', 'col-lg-1', 'col-lg-offset-9', 'btn-success'];
    }

    return (
      <a href={href} className={classes.join(' ')}>{label}</a>
    );
  }
});

module.exports = Header;
