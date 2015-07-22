'use strict';

var React = require('react');

var Layout = require('../layouts/default.jsx');
var Dashboard = require('../components/github/dashboard.jsx');
var Header = require('../components/header.jsx');

module.exports = React.createClass({
  render: function () {
    return (
      <Layout className="page-container" stylesheets={[{href: '/css/main.css'}]}>
        <div id="mount-header">
          <Header user={this.props.user} authenticated={this.props.authenticated} accessToken={this.props.accessToken}/>
        </div>
        <div id="mount-github">
          <Dashboard user={this.props.user} accessToken={this.props.accessToken} repositoriesUrl={this.props.repositoriesUrl}/>
        </div>

        <script src="/views/github.js"></script>
      </Layout>
    );
  }
});
