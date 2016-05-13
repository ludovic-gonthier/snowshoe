import React, { Component, PropTypes } from 'react';

import { TeamsDropdown } from './dropdowns/Teams.jsx';
import { OrganizationsDropdown } from './dropdowns/Organizations.jsx';
import { UserDropdown } from './dropdowns/User.jsx';

export class Navbar extends Component {
  render() {
    const { organizations, teams, token, user } = this.props;
    const { emitDataToSocket } = this.props;

    return (
      <span>
        <ul className="nav navbar-nav">
          {user && <UserDropdown user={ user } /> }
          <OrganizationsDropdown {...{ organizations, emitDataToSocket }} />
          <TeamsDropdown {... { emitDataToSocket, hasUser: !!user, token, teams }} />
        </ul>
      </span>
    );
  }
}

Navbar.propTypes = {
  organizations: PropTypes.array.isRequired,
  emitDataToSocket: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object,
};
