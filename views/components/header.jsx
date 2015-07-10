'use strict';

var React = require('react');

var Navbar = require('../components/navbar.jsx');
var Login = require('../components/buttons/login.jsx');
var Logout = require('../components/buttons/logout.jsx');

module.exports = React.createClass({
  render: function () {
    var Authentification = <Login className="navbar-btn col-lg-1 col-lg-offset-9"/>;

    if (this.props.authenticated) {
      Authentification = <Logout className="navbar-btn col-lg-1 col-lg-offset-1"/>;
    }

    return (
      <header className="navbar navbar-default">
        <div className="container">
          <a href="/" className="navbar-brand col-lg-2">SnowShoe</a>

          {this.props.authenticated ? <Navbar /> : ''}
          {Authentification}
        </div>
      </header>
    );
  }
});
