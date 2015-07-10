'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function () {
    var classes = [
      'btn',
      'btn-primary'
    ].concat(this.props.className)
    .join(' ');

    return (
      <a href="/logout"
         className={classes}
      >
        Log Out
      </a>
    );
  }
});
