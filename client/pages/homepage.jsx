import { default as _ } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import { Layout } from '../layouts/Default.jsx';

import { default as Application } from '../containers/Application';
import { default as DevTools } from '../containers/DevTools.jsx';
import { default as configureStore } from '../stores';

export default class Homepage extends Component {
  injectInitialState(state) {
    const innerHtml = () => ({ __html: `window.__INITIAL_STATE__ = ${JSON.stringify(state)};` });

    return (
      <script dangerouslySetInnerHTML={ innerHtml() } />
    );
  }

  render() {
    const { initialState } = this.props;
    const { authenticated, page } = initialState;
    const store = configureStore(_.omit(['authenticated', 'page', 'repositoriesUrl']));

    let Module = (
      <Provider store={ store }>
        <div>
          <Application {...{ authenticated, page }} />
          <DevTools />
        </div>
      </Provider>
    );

    if (process.env.NODE_ENV === 'production') {
      Module = (
        <Provider store={ store }>
          <Application {...{ authenticated, page }} />
        </Provider>
      );
    }

    return (
      <Layout className="page-container" stylesheets={[{ href: '/css/main.css' }]}>
        { this.injectInitialState(initialState) }

        <div id="mount-application">
          { Module }
        </div>

        <script src="/main.js"></script>
      </Layout>
    );
  }
}

Homepage.propTypes = {
  initialState: PropTypes.object,
};
