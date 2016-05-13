import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { Container } from '../components/github/Container';
import { Header } from '../components/Header';
import { HomepageJumbotron } from '../components/HomepageJumbotron';

class Application extends Component {
  render() {
    const { authenticated, github, page, socket } = this.props;
    const { emitDataToSocket } = this.props;

    const {
      organizations,
      rate,
      token,
      teams,
      pulls,
      user,
    } = github;

    let Body;
    if (page === 'homepage') {
      Body = <HomepageJumbotron />;
    } else {
      Body = (
        <section className="dashboard clearfix">
          <Container pulls={ pulls } />
        </section>
      );
    }

    return (
      <div>
        <Header {...{
          authenticated,
          emitDataToSocket,
          organizations,
          rate,
          token,
          teams,
          user }}
        />

        { Body }

        { !socket.connected &&
          <div className="alert alert-danger socket-closed" role="alert">
            Connection to the server lost. Refresh the page to have fresh data again!
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    github: state.github,
    socket: state.socket,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);

Application.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  emitDataToSocket: PropTypes.func.isRequired,
  github: PropTypes.shape({
    organizations: PropTypes.array.isRequired,
    pulls: PropTypes.array.isRequired,
    rate: PropTypes.object,
    teams: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
    user: PropTypes.object,
  }),
  page: PropTypes.string.isRequired,
  socket: PropTypes.shape({
    connected: PropTypes.bool.isRequired,
  }),
};
