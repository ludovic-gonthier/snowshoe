import React, { Component, PropTypes } from 'react';

export class OrganizationsDropdown extends Component {
  render() {
    const { organizations } = this.props;
    const { emitDataToSocket } = this.props;
    const attributes = {};

    if (organizations.length === 0) {
      attributes.disabled = 'disabled';
    }

    return (
      <li className="dropdown">
        <a href="#"
          className="dropdown-toggle btn"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          {...attributes}
        >
          Organizations
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          {organizations.length === 0 ? null :
            organizations.map((organization, index) => (
              <li role="presentation" key={index}>
                <a role="menuitem" onClick={ () => emitDataToSocket('teams', organization.login) }>
                  {organization.login}
                </a>
              </li>
              ))
          }
        </ul>
      </li>
    );
  }
}

OrganizationsDropdown.propTypes = {
  organizations: PropTypes.array.isRequired,
  emitDataToSocket: PropTypes.func.isRequired,
};
