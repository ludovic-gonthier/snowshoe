import React from 'react';

import { Layout } from '../../components/layouts/Default.jsx';
import { Header } from '../../components/Header.jsx';
import { LoginJumbotron } from '../../components/LoginJumbotron.jsx';

export default () => (
  <Layout stylesheets={[{ href: '/css/login.css' }]}>
    <Header />
    <div id="mount-login-jumbotron" className="container">
      <LoginJumbotron />
    </div>

    <script src="/login.js"></script>
  </Layout>
);
