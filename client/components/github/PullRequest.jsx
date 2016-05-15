import React, { Component, PropTypes } from 'react';
import { PullRequestStatuses } from './PullRequestStatuses';

export class PullRequest extends Component {
  computeLabelStyle(labelColor) {
    const rgb = labelColor.match(/.{2}/g).map((color) => parseInt(color, 16) / 255);
    const max = Math.max(rgb[0], rgb[1], rgb[2]);
    const min = Math.min(rgb[0], rgb[1], rgb[2]);

    return {
      color: (max + min) / 2 > 0.6 ? 'black' : 'white',
      background: `#${labelColor}`,
    };
  }

  render() {
    const { pull } = this.props;
    const classes = ['img-circle'];

    if (pull.lastStatus) {
      classes.push(pull.lastStatus.state);
    }

    return (
      <div className="pull-request thumbnail">
        <header className="caption text-center ellipsis"
          title={pull.base.repo.name}
        >
            <strong>{pull.base.repo.name}</strong>
        </header>
        <span className="badge">
          <span className="glyphicon glyphicon-comment pull-left"></span>
          <span className="github-commemts-number">{pull.comments || 0}</span>
        </span>
        <PullRequestStatuses pull={ pull }/>

        <div className="text-center github-title ellipsis" title={pull.title}>
          { pull.isTitleDisplayed ? pull.title : '' }
        </div>
        <div className="caption text-center github-request-number">
          <a href={pull.html_url} target="_blank">
            #{pull.number}
          </a>
        </div>
        {!pull.labels ? '' :
          pull.labels.map((label, index) => (
            <div key={index}
              style={this.computeLabelStyle(label.color)}
              className="github-label text-center ellipsis"
              title={label.name}
            >
              {label.name}
            </div>
          ))
        }
      </div>
    );
  }
}

PullRequest.propTypes = {
  pull: PropTypes.shape({
    base: PropTypes.shape({
      repo: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }),
    comments: PropTypes.number,
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
