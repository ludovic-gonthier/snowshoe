import React, { Component, PropTypes } from 'react';

import { Navbar } from './Navbar.jsx';
import { Login } from './buttons/Login.jsx';
import { Logout } from './buttons/Logout.jsx';
import { RateLimit } from './github/RateLimit.jsx';

export class Header extends Component {
  render() {
    const {
      authenticated,
      organizations,
      rate,
      teams,
      token,
      user,
    } = this.props;
    const { emitDataToSocket } = this.props;

    const Authentification = authenticated ? <Logout /> : <Login />;
    let Navigation = '';

    if (token || authenticated) {
      Navigation = <Navbar {...{ emitDataToSocket, organizations, teams, token, user }} />;
    }

    return (
      <header className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#nav-header"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">SnowShoe</a>
          </div>

          <div className="collapse navbar-collapse" id="nav-header">

            { Navigation }

            <div className="navbar-right">
              <RateLimit rate={ rate } />
              <ul className="nav navbar-nav">
                { Authentification }
              </ul>
            </div>

          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  emitDataToSocket: PropTypes.func.isRequired,
  organizations: PropTypes.array.isRequired,
  rate: PropTypes.object,
  teams: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object,
};
