import React, { Component, PropTypes } from 'react';

const colors = {
  failure: '#bd2c00',
  error: '#bd2c00',
  pending: '#cea61b',
  success: '#6cc644',
};

const RADIAN_MULTIPLIER = Math.PI / 180.0;

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * RADIAN_MULTIPLIER;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
  ].join(' ');
}

export class PullRequestStatus extends Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    window.open(this.props.status.target_url, '_blank');
  }

  render() {
    const { index, number, radius, status, strokeWidth } = this.props;
    const center = radius - (strokeWidth / 4);
    const angle = 360 / number;
    const start = index * angle;
    let pathProps = {}
    let end = (index + 1) * angle;

    if (end === 360) {
      end = 359.99;
    }

    if (status.target_url) {
      pathProps = {
        className: "cursor-pointer",
        onClick: this.onClick
      }
    }

    return (
      <path
        d={describeArc(center, center, radius, start, end)}
        stroke={colors[status.state]}
        strokeWidth={strokeWidth}
        fill="transparent"
        {...pathProps}
      >
        <title>{status.context}</title>
      </path>
    );
  }
}

PullRequestStatus.propTypes = {
  index: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  status: PropTypes.shape({
    context: PropTypes.string.isRequired,
    target_url: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  strokeWidth: PropTypes.number.isRequired,
};
