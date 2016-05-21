import React, { PropTypes } from 'react';

import { PullRequestDropdown } from './dropdowns/PullRequestDropdown.jsx';
import { FilterByDropdown } from './dropdowns/FilterByDropdown.jsx';
import { OrderByDropdown } from './dropdowns/OrderByDropdown.jsx';

export const Navbar = (props) => {
  const { filters, pulls, organizations, teams, token, user, order } = props;
  const { changeOrderDirection, changeOrderField, emitDataToSocket, filterByLabels } = props;

  const disabled = pulls.length === 0;

  return (
    <span>
      <ul className="nav navbar-nav">
        <PullRequestDropdown {...{ user, organizations, emitDataToSocket, teams, token }} />
        <FilterByDropdown {...{ disabled, filterByLabels, filters, pulls }} />
        <OrderByDropdown {...{ changeOrderDirection, changeOrderField, disabled, order }} />

      </ul>
    </span>
  );
};

Navbar.propTypes = {
  changeOrderDirection: PropTypes.func.isRequired,
  changeOrderField: PropTypes.func.isRequired,
  emitDataToSocket: PropTypes.func.isRequired,
  filterByLabels: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  organizations: PropTypes.array.isRequired,
  order: PropTypes.shape({
    direction: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }).isRequired,
  teams: PropTypes.array.isRequired,
  pulls: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object,
};
