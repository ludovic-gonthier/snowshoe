import React, { Component, PropTypes } from 'react';

export class TeamsDropdown extends Component {
  render() {
    const { teams } = this.props;
    const attributes = {};

    if (teams.length === 0) {
      attributes.disabled = 'disabled';
    }

    return (
      <li className="dropdown">
        <a href="#"
          className="btn dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          {...attributes}
        >
          Teams
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
        { teams.map((team, index) => (
            <li role="presentation" key={ index }>
              <a role="menuitem" href={ team.href }>{ team.name }</a>
            </li>
          ))
        }
        </ul>
      </li>
    );
  }
}

TeamsDropdown.propTypes = {
  teams: PropTypes.array.isRequired,
};
