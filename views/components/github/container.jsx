'use strict';

var React = require('react');

var PullRequest = require('./pull-request.jsx');

module.exports = React.createClass({
  render: function () {
    return (
      <div className="pull-container container-fluid">
        {this.props.pulls.map(function (pull, index) {
          return <PullRequest key={index} pull={pull} />;
        })}
      </div>
    );
  }
});
