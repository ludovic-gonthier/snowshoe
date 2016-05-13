import React, { Component, PropTypes } from 'react';

export class UserDropdown extends Component {
  render() {
    return (
      <li className="dropdown">
        <a href="#"
          className="btn dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.props.user.login}
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          <li>
            <a href="/user/personal/">My Repositories</a>
          </li>
          <li>
            <a href="/user/contributing/">Contributing to</a>
          </li>
        </ul>
      </li>
    );
  }
}

UserDropdown.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
  }),
};
