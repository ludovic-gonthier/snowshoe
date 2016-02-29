import passport from 'passport';
import url from 'url';
import { Strategy } from 'passport-github';

import { config } from '../../config';

export default passport;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new Strategy({
  clientID: config.get('github.client.id'),
  clientSecret: config.get('github.client.secret'),
  callbackURL: url.format({
    protocol: config.get('server.protocol'),
    host: config.get('server.host'),
    pathname: '/auth/github/callback',
  }) },
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(() => {
      /* eslint-disable no-param-reassign */
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      /* eslint-enable no-param-reassign */

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));
