import React from 'react';

import Layout from '../../components/layouts/Default';
import Header from '../../components/Header';
import LoginJumbotron from '../../components/LoginJumbotron';

export default () => (
  <Layout stylesheets={[{ href: '/css/login.css' }]}>
    <Header />
    <div id="mount-login-jumbotron" className="container">
      <LoginJumbotron />
    </div>

    <script src="/login.js" />
  </Layout>
);
