import express from 'express';

import { default as storeMiddleware } from '../middlewares/store';

import { default as firewall } from './firewall';
import { default as homepage } from './homepage';
import { default as pulls } from './pulls';
import { default as authentification } from './authentification';
import { default as error } from './error';

const router = new express.Router();

router.use(storeMiddleware);

[
  firewall,
  homepage,
  pulls,
  authentification,
  error,
].forEach((callback) => callback(router));

export default router;
