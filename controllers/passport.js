'use strict';

var passport = require('passport');
var url = require('url');
var Strategy = require('passport-github').Strategy;

module.exports = passport;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: url.format({
      protocol: process.env.SNOWSHOE_APP_PROTOCOL || 'http',
      host : process.env.SNOWSHOE_HOSTNAME || "",
      pathname : '/auth/github/callback'
    })
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));
