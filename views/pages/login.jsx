'use strict';

var React = require('react');

var Layout = require('../layouts/default');
var Header = require('../components/header');

module.exports = React.createClass({
  render: function () {

    return (
      <Layout>
        <Header/>
        <div className="container">
          <div className="jumbotron col-lg-6 col-lg-offset-2">
            <h2>Welcome to <strong>SnowShoe</strong> Dashboards</h2>
            <p>One must be connected before having access to his pull requests!</p>
            <p className="clearfix"><a className="btn btn-success btn-lg pull-right" href="/auth/github" role="button">Log In</a></p>
          </div>
        </div>
      </Layout>
    );
  }
});
