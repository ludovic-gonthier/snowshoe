'use strict';

var _ = require('lodash');
var React = require('react');

var PullRequest = require('./pull-request.jsx');

module.exports = React.createClass({
  render: function () {
    return (
      <div className="container-fluid">
        {_.chunk(this.props.pulls, 8).map(function (splice, chunckIndex) {
          return (
            <div key={chunckIndex} className="row row-eq-height">
              {splice.map(function (pull, index) {
                return <PullRequest key={index} pull={pull} />;
              })}
            </div>
          );
        })}
      </div>
    );
  }
});
