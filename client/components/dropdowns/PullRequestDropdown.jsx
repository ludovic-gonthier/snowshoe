import React, { Component, PropTypes } from 'react';

import Dropdown from '../Dropdown';

class PullRequestDropdown extends Component {
  constructor() {
    super();

    this.onOrganizationClick = this.onOrganizationClick.bind(this);
    this.state = { loading: false };
  }

  componentWillReceiveProps() {
    this.setState({ loading: false });
  }

  onOrganizationClick(organization) {
    this.setState({ loading: true });
    this.props.emitDataToSocket('teams', organization.login);
  }

  render() {
    const { user, organizations, teams } = this.props;

    return (
      <Dropdown title="Pull Requests">
        {user && <li role="presentation" className="dropdown-header">{user.login}</li>}
        {user && <li><a href="/user/personal/">My Repositories</a></li>}
        {user && <li><a href="/user/contributing/">Contributing to</a></li>}
        {user && <li role="presentation" className="divider" />}

        <li role="presentation" className="dropdown-header">Organizations</li>
        {organizations.map((organization, key) => (
          <li key={key}>
            <a onClick={() => this.onOrganizationClick(organization)}>
              {organization.login}
            </a>
          </li>
        ))}

        <li role="presentation" className="divider" />
        <li role="presentation" className="dropdown-header">Teams</li>
        {this.state.loadgin
          ? <li><a>Loading…</a></li>
          : teams.map((team, key) => (
            <li key={key}>
              <a href={team.href}>{team.name}</a>
            </li>
          ))
        }
      </Dropdown>
    );
  }
}

PullRequestDropdown.propTypes = {
  emitDataToSocket: PropTypes.func.isRequired,
  organizations: PropTypes.arrayOf(PropTypes.shape({
    login: PropTypes.string.isRequired,
  })),
  teams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })),
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
  }),
};

export default PullRequestDropdown;
