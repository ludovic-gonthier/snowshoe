import _ from 'lodash';
import React, { PropTypes } from 'react';

import { PullRequest } from './PullRequest.jsx';

function filterPulls(pulls, filters) {
  return pulls.filter((pull) => {
    if (!pull.labels) {
      return true;
    }

    return pull.labels
      .filter((label) => filters.labels.indexOf(label.name) !== -1)
      .length === 0;
  });
}

function orderPulls(pulls, order) {
  return _.orderBy(pulls, order.field, order.direction);
}

export const Container = ({ filters, order, pulls }) => (
  <div className="pull-container container-fluid">
    {orderPulls(filterPulls(pulls, filters), order).map((pull, index) => (
      <PullRequest key={index} pull={pull} />
    ))}
  </div>
);

Container.propTypes = {
  filters: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  order: PropTypes.shape({
    direction: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }),
  pulls: PropTypes.array.isRequired,
};
