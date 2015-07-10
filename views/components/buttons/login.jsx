'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function () {
    var classes = [
      'btn',
      'btn-success'
    ].concat(this.props.className)
    .join(' ');

    return (
      <a href="/auth/github"
         className={classes}
      >
        Log In
      </a>
    );
  }
});
