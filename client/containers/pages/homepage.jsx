import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';

import Layout from '../../components/layouts/Default';

import Application from '../Application';
import configureStore from '../../stores';

function injectInitialState(state) {
  const innerHtml = () => ({ __html: `window.__INITIAL_STATE__ = ${JSON.stringify(state)};` });

  /* eslint-disable react/no-danger */
  return (
    <script dangerouslySetInnerHTML={innerHtml()} />
  );
  /* eslint-enable react/no-danger */
}

const Homepage = ({ initialState }) => {
  const { authenticated, page } = initialState;
  const store = configureStore(_.omit(
    initialState,
    ['authenticated', 'page', 'repositoriesUrl'],
  ));

  return (
    <Layout className="page-container" stylesheets={[{ href: '/css/main.css' }]}>
      {injectInitialState(initialState)}

      <div id="mount-application">
        <Provider store={store}>
          <Application {...{ authenticated, page }} />
        </Provider>
      </div>

      <script src="/main.js" />
    </Layout>
  );
};

Homepage.propTypes = {
  initialState: PropTypes.shape({
    page: Application.propTypes.page,
    authenticated: Application.propTypes.authenticated,
  }),
};

export default Homepage;
