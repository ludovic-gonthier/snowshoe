import React, { Component, PropTypes } from 'react';

import { PullRequest } from './PullRequest.jsx';

export class Container extends Component {
  render() {
    const { pulls } = this.props;

    return (
      <div className="pull-container container-fluid">
        {pulls.map((pull, index) => <PullRequest key={index} pull={pull} />)}
      </div>
    );
  }
}

Container.propTypes = {
  pulls: PropTypes.array.isRequired,
};
