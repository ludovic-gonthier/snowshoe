import React, { Component, PropTypes } from 'react';

export class RateLimit extends Component {
  padTimeString(time) {
    if (time < 10) {
      return `0 ${time}`;
    }

    return time;
  }

  computeRateCssColor() {
    const percent = (this.props.rate.remaining * 100) / this.props.rate.limit;

    if (percent <= 10) {
      return 'label-danger';
    }

    if (percent <= 35) {
      return 'label-warning';
    }

    return 'label-info';
  }

  render() {
    const { rate } = this.props;

    if (!rate || !rate.reset) {
      return null;
    }

    const style = `label ${this.computeRateCssColor()}`;
    const minutes = this.padTimeString(rate.reset.getMinutes());
    const hours = this.padTimeString(rate.reset.getHours());

    return (
      <p id="rate-limit" className="navbar-text">
        <span title={ `Github API calls available. Reset at ${hours}:${minutes}` }>
          Rate : <span className={ style }>{ rate.remaining }/{ rate.limit }</span>
        </span>
      </p>
    );
  }
}

RateLimit.propTypes = {
  rate: PropTypes.object,
};
