import express from 'express';

import storeMiddleware from '../middlewares/store';

import firewall from './firewall';
import homepage from './homepage';
import pulls from './pulls';
import authentification from './authentification';
import error from './error';

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
