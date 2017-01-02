import React from 'react';
import { render } from 'react-dom';

import LoginJumbotron from '../components/LoginJumbotron';

const LoginJumbotronComponent = React.createFactory(LoginJumbotron);

render(new LoginJumbotronComponent(), document.getElementById('mount-login-jumbotron'));
