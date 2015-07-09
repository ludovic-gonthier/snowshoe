'use strict';

var React = require('react');

var Layout = require('../layouts/default');
var Dashboard = require('../components/github/dashboard');
var Header = require('../components/header');

module.exports = React.createClass({
  render: function () {
    return (
      <Layout className="page-container" stylesheets={[{href: '/css/main.css'}]}>
        <div id="mount-header">
          <Header authenticated={this.props.authenticated}/>
        </div>
        <div id="mount-github">
          <Dashboard user={this.props.user} repositories_url={this.props.repositories_url}/>
        </div>

        <script src="/views/github.js"></script>
      </Layout>
    );
  }
});
