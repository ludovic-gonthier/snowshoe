'use strict';

var passport = require('passport');
var url = require('url');
var Strategy = require('passport-github').Strategy;

var config = require('config');

module.exports = passport;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new Strategy({
    clientID: config.get('github.token.public'),
    clientSecret: config.get('github.token.secret'),
    callbackURL: url.format({
      protocol: 'http',
      host : config.get('server.host'),
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
