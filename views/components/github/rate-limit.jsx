'use strict';

var React = require('react');
var io = require('socket.io-client');

module.exports = React.createClass({
  getInitialState: function () {
    return {
    };
  },
  handleRate: function (data) {
    data.reset = new Date(data.reset * 1000);

    this.setState({rate: data});
  },
  componentDidMount: function () {
    io().on('rate', this.handleRate);
  },
  padTimeString: function(time) {
    if (time < 10) {
      time = '0' + time;
    }

    return time;
  },
  computeRateCssColor: function() {
    var percent = (this.state.rate.remaining * 100) / this.state.rate.limit;

    if (percent <= 10) {
      return 'label-danger';
    }

    if (percent <= 35) {
      return 'label-warning';
    }

    return 'label-info';
  },
  render: function () {
    var style;
    var minutes;
    var hours;

    if (!this.state.rate) {
      return null;
    }

    style = 'label ' + this.computeRateCssColor();
    minutes = this.padTimeString(this.state.rate.reset.getMinutes());
    hours = this.padTimeString(this.state.rate.reset.getHours());

    return (
      <p id="rate-limit" className="navbar-text">
        <span title={'Github API calls available. Reset at ' + hours + ':' + minutes}>
          Rate : <span className={style}>{this.state.rate.remaining}/{this.state.rate.limit}</span>
        </span>
      </p>
    );
  }
});
