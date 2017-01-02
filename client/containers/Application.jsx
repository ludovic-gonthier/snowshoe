import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Container from '../components/github/Container';
import Header from '../components/Header';
import HomepageJumbotron from '../components/HomepageJumbotron';

const Application = (props) => {
  const { authenticated, filters, github, order, page, socket } = props;
  const { changeOrderDirection, changeOrderField, filterByLabels, emitDataToSocket } = props;

  return (
    <div>
      <Header
        {...{ authenticated, filters, order }}
        {...{ changeOrderDirection, changeOrderField, filterByLabels, emitDataToSocket }}
        {...github}
      />

      {page === 'homepage'
        ? <HomepageJumbotron />
        : (
          <section className="dashboard clearfix">
            <Container pulls={github.pulls} filters={filters} order={order} />
          </section>
        )
      }

      {!socket.connected &&
        <div className="alert alert-danger socket-closed" role="alert">
          Connection to the server lost. Refresh the page to have fresh data again!
        </div>
      }
    </div>
  );
};

Application.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  changeOrderDirection: PropTypes.func.isRequired,
  changeOrderField: PropTypes.func.isRequired,
  emitDataToSocket: PropTypes.func.isRequired,
  filterByLabels: PropTypes.func.isRequired,
  github: PropTypes.shape({
    organizations: PropTypes.array.isRequired,
    pulls: PropTypes.array.isRequired,
    rate: PropTypes.object,
    teams: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
    user: PropTypes.object,
  }),
  order: PropTypes.shape({
    direction: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }).isRequired,
  page: PropTypes.string.isRequired,
  socket: PropTypes.shape({
    connected: PropTypes.bool.isRequired,
  }),
  filters: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};

function mapStateToProps(state) {
  return {
    filters: state.filters,
    github: state.github,
    order: state.order,
    socket: state.socket,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Application);
