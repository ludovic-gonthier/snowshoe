import React, { PropTypes } from 'react';

function padTimeString(time) {
  if (time < 10) {
    return `0 ${time}`;
  }

  return time;
}
function computeRateCssColor(remaining, limit) {
  const percent = (remaining * 100) / limit;

  if (percent <= 10) {
    return 'label-danger';
  }

  if (percent <= 35) {
    return 'label-warning';
  }

  return 'label-info';
}

const RateLimit = ({ rate }) => {
  if (!rate || !rate.reset) {
    return null;
  }

  const style = `label ${computeRateCssColor(rate.remaining, rate.limit)}`;
  const minutes = padTimeString(rate.reset.getMinutes());
  const hours = padTimeString(rate.reset.getHours());

  return (
    <p id="rate-limit" className="navbar-text">
      <span title={`Github API calls available. Reset at ${hours}:${minutes}`}>
        Rate : <span className={style}>{rate.remaining}/{rate.limit}</span>
      </span>
    </p>
  );
};

RateLimit.propTypes = {
  rate: PropTypes.shape({
    reset: PropTypes.instanceOf(Date),
    remaining: PropTypes.string,
    limit: PropTypes.string,
  }),
};

export default RateLimit;
