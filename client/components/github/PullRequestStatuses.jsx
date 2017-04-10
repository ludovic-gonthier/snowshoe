import React, { PropTypes } from 'react';

import PullRequestStatus from './PullRequestStatus';

const RADIUS = 60;
const STROKE_WIDTH = 40;
const IMAGE_RADIUS = RADIUS - (STROKE_WIDTH / 2);

const PullRequestStatuses = ({ pull }) => {
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

      <clipPath id="clip-circle">
        <circle r={IMAGE_RADIUS} cx="50" cy="50" />
      </clipPath>

      <image
        x="10%"
        y="10%"
        width="80%"
        height="80%"
        xlinkHref={pull.user.avatar_url}
        style={{
          clipPath: 'url(#clip-circle)',
        }}
      >
        <title>{pull.user.login}</title>
      </image>

    </svg>
  );
};

PullRequestStatuses.propTypes = {
  pull: PropTypes.shape({
    status: PropTypes.shape({
      statuses: PropTypes.arrayOf(PropTypes.shape({
        context: PropTypes.string.isRequired,
        target_url: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
      })),
    }),
    user: PropTypes.shape({
      avatar_url: PropTypes.string.isRequired,
      login: PropTypes.string.isRequired,
    }),
  }),
};

export default PullRequestStatuses;
