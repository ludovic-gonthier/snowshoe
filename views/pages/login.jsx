'use strict';

var React = require('react');

var Layout = require('../layouts/default.jsx');
var Header = require('../components/header.jsx');
var LoginJumbotron = require('../components/login-jumbotron.jsx');

module.exports = React.createClass({
  render: function () {
    return (
      <Layout stylesheets={[{href: '/css/login.css'}]}>
        <Header />
        <div id="mount-login-jumbotron" className="container">
          <LoginJumbotron />
        </div>

        <script src="/views/login.js"></script>
      </Layout>
    );
  }
});
