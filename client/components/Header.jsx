import React, { PropTypes } from 'react';

import Navbar from './Navbar';
import Login from './buttons/Login';
import Logout from './buttons/Logout';
import RateLimit from './github/RateLimit';

const Header = (props) => {
  const {
    authenticated,
    rate,
    token,
  } = props;

  const Authentification = authenticated ? <Logout /> : <Login />;
  let Navigation = '';

  if (token || authenticated) {
    Navigation = <Navbar {...props} />;
  }

  return (
    <header className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#nav-header"
            aria-expanded="false"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <a className="navbar-brand" href="/">
            <img src="/img/logo.svg" role="presentation" width="40" height="40" />
          </a>
        </div>

        <div className="collapse navbar-collapse" id="nav-header">

          {Navigation}

          <div className="navbar-right">
            <RateLimit rate={rate} />
            <ul className="nav navbar-nav">
              {Authentification}
            </ul>
          </div>

        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  authenticated: PropTypes.bool,
  rate: PropTypes.shape(RateLimit.propTypes),
  token: PropTypes.string,
  filters: Navbar.propTypes.filters, // eslint-disable-line react/no-unused-prop-types
};

export default Header;
