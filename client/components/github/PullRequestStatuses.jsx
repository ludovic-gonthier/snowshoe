import React, { Component, PropTypes } from 'react';
import { PullRequestStatus } from './PullRequestStatus';

const RADIUS = 60;
const STROKE_WIDTH = 40;
const IMAGE_RADIUS = RADIUS - (STROKE_WIDTH / 2);

export class PullRequestStatuses extends Component {
  render() {
    const pull = this.props.pull;
    let number = 0;

    if (pull.status) {
      number = pull.status.statuses.length;
    }

    return (
      <svg className="img-circle" width="100px" height="100px" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="transparent"
          strokeWidth={STROKE_WIDTH}
          stroke="#888"
        />

        {pull.status &&
          pull.status.statuses.map((status, index) => (
            <PullRequestStatus
              key={index}
              radius={RADIUS}
              status={status}
              strokeWidth={STROKE_WIDTH}
              index={index}
              number={number}
            />
          ))
         }

        <defs>
          <pattern
            id={`image${pull.id}`}
            x="0%"
            y="0%"
            height="100%"
            width="100%"
            viewBox="0 0 460 460"
          >
            <image
              x="0%"
              y="0%"
              width="460"
              height="460"
              xlinkHref={pull.user.avatar_url}
            />
          </pattern>
        </defs>

        <clipPath id="clipCircle">
          <circle r={IMAGE_RADIUS} cx="50" cy="50" />
        </clipPath>

        <circle cx="50" cy="50" r={IMAGE_RADIUS} fill={`url(#image${pull.id})`}>
          <title>{pull.user.login}</title>
        </circle>
      </svg>
    );
  }
}

PullRequestStatuses.propTypes = {
  pull: PropTypes.shape({
    status: PropTypes.shape({
      context: PropTypes.string.isRequired,
      target_url: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
    }),
  }),
};
