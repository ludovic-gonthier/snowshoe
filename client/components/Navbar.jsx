import React, { PropTypes } from 'react';

import PullRequestDropdown from './dropdowns/PullRequestDropdown';
import FilterByDropdown from './dropdowns/FilterByDropdown';
import OrderByDropdown from './dropdowns/OrderByDropdown';

const Navbar = (props) => {
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
  organizations: PullRequestDropdown.propTypes.organizations,
  order: PropTypes.shape({
    direction: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }).isRequired,
  teams: PullRequestDropdown.propTypes.teams,
  pulls: FilterByDropdown.propTypes.pulls,
  token: PropTypes.string.isRequired,
  user: PullRequestDropdown.propTypes.user,
};

export default Navbar;
