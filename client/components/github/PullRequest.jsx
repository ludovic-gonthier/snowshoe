import React, { PropTypes } from 'react';
import { PullRequestStatuses } from './PullRequestStatuses';
import { Label } from './Label';

export const PullRequest = ({ pull }) => {
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
      <span className="badge">
        <span className="glyphicon glyphicon-comment pull-left"></span>
        <span className="github-commemts-number">{pull.comments || 0}</span>
      </span>
      <PullRequestStatuses pull={pull} />

      <div className="text-center github-title ellipsis" title={pull.title}>
        {pull.isTitleDisplayed ? pull.title : ''}
      </div>
      <div className="caption text-center github-request-number">
        <a href={pull.html_url} target="_blank">
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
