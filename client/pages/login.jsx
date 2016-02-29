import React, { Component } from 'react';

import { Layout } from '../layouts/Default.jsx';
import { Header } from '../components/Header.jsx';
import { LoginJumbotron } from '../components/LoginJumbotron.jsx';

export default class Login extends Component {
  render() {
    return (
      <Layout stylesheets={[{ href: '/css/login.css' }]}>
        <Header />
        <div id="mount-login-jumbotron" className="container">
          <LoginJumbotron />
        </div>

        <script src="/login.js"></script>
      </Layout>
    );
  }
}
