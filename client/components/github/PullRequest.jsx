import React, { PropTypes } from 'react';

import PullRequestStatuses from './PullRequestStatuses';
import Label from './Label';

/* eslint-disable max-len */
const badge = {
  error: (
    <svg
      aria-hidden="true"
      height="16"
      version="1.1"
      viewBox="0 0 12 16"
      width="12"
      style={{
        color: '#bd2c00',
        fill: 'currentColor',
      }}
    >
      <path
        fillRule="evenodd"
        d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"
      />
    </svg>
  ),
  success: (
    <svg
      aria-hidden="true"
      height="16"
      version="1.1"
      viewBox="0 0 12 16"
      width="12"
      style={{
        color: '#55a532',
        fill: 'currentColor',
      }}
    >
      <path
        fillRule="evenodd"
        d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"
      />
    </svg>
  ),
};
/* eslint-enable max-len */

const PullRequest = ({ pull }) => {
  const classes = ['img-circle'];
  const attributes = {};

  if (pull.lastStatus) {
    classes.push(pull.lastStatus.state);
  }

  if (pull.disabled) {
    attributes.disabled = 'disabled';
  }

  return (
    <div className="pull-request thumbnail" {...attributes}>
      <header
        className="caption text-center ellipsis"
        title={pull.base.repo.name}
      >
        <strong>{pull.base.repo.name}</strong>
      </header>
      <div className="badge-wrapper">
        <span className="badge">
          {pull.mergeable ? badge.success : badge.error}
        </span>
        <span className="badge">
          {pull.viewed
            ? <span className="glyphicon glyphicon-eye-open" />
            : ''
          }
        </span>
      </div>
      <PullRequestStatuses pull={pull} />

      <div className="text-center github-title ellipsis" title={pull.title}>
        {pull.isTitleDisplayed ? pull.title : ''}
      </div>
      <div className="caption text-center github-request-number">
        <a href={pull.html_url} target="_blank" rel="noopener noreferrer">
          #{pull.number}
        </a>
      </div>
      {!pull.labels ? '' :
        pull.labels.map((label, index) => (
          <Label key={index} {...label} />
        ))
      }
    </div>
  );
};

PullRequest.propTypes = {
  pull: PropTypes.shape({
    base: PropTypes.shape({
      repo: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }),
    comments: PropTypes.number,
    disabled: PropTypes.bool,
    html_url: PropTypes.string.isRequired,
    isTItleDisplayed: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })),
    number: PropTypes.number,
    title: PropTypes.string.isReqired,
  }),
};

export default PullRequest;
