import express from 'express';

import { default as firewall } from './firewall';
import { default as homepage } from './homepage';
import { default as pulls } from './pulls';
import { default as authentification } from './authentification';
import { default as error } from './error';

const Router = new express.Router();

[
  firewall,
  homepage,
  pulls,
  authentification,
  error,
].forEach((callback) => callback(Router));

export default Router;
