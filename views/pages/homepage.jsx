'use strict';

var React = require('react');

var Dashboard = require('../components/github/dashboard.jsx');
var Header = require('../components/header.jsx');
var HomepageJumbotron = require('../components/homepage-jumbotron.jsx');
var Layout = require('../layouts/default.jsx');

module.exports = React.createClass({
  render: function () {
    return (
      <Layout className="page-container" stylesheets={[{href: '/css/main.css'}]}>
        <div id="mount-header">
          <Header user={this.props.user} authenticated={this.props.authenticated} accessToken={this.props.accessToken}/>
        </div>
        <div id="mount-github">
            <Dashboard accessToken={this.props.accessToken} repositoriesUrl={this.props.repositoriesUrl}/>
        </div>
        {this.props.isHomepage &&
        <div id="mount-jumbotron">
            <HomepageJumbotron />
        </div>
        }

        <script src="/views/github.js"></script>
      </Layout>
    );
  }
});
