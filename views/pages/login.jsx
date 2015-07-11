'use strict';

var React = require('react');

var Layout = require('../layouts/default.jsx');
var Header = require('../components/header.jsx');
var Login = require('../components/buttons/login.jsx');

module.exports = React.createClass({
  render: function () {
    return (
      <Layout>
        <Header />
        <div className="container">
          <div className="jumbotron col-lg-6 col-lg-offset-2">
            <h2>Welcome to <strong>SnowShoe</strong> Dashboards</h2>
            <p>One must be connected before having access to his pull requests!</p>
            <p className="clearfix">
              <a href="/auth/github" className="btn btn-success btn-lg pull-right">Log In</a>
            </p>
          </div>
        </div>
      </Layout>
    );
  }
});
