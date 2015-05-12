'use strict';

var React = require('react');

var Layout = require('../layouts/default');
var Github = require('../components/github');
var Header = require('../components/header');

module.exports = React.createClass({
  render: function () {
    return (
      <Layout className="page-container" stylesheets={[{href: '/css/main.css'}]}>
        <div id="mount-header">
          <Header authenticated={this.props.authenticated}/>
        </div>
        <div id="mount-github">
          <Github user={this.props.user}/>
        </div>

        <script src="views/github.js"></script>
      </Layout>
    );
  }
});
