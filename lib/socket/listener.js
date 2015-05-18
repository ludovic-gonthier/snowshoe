'use strict';

var _ = require('lodash');
var async = require('async');
var config = require('config');
var url = require('url');

var fetcher = require('../github-fetcher');

var pollTimeout = config.get('github.poll-timeout') * 1000;

module.exports = function (socket) {
  var timeout = null;

  socket.on('disconnect', function () {
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  socket.on('user', function (data) {
    console.log('access-token: ' + data.accessToken);

    var user = data.user;
    var github = fetcher(socket, data.accessToken);

    socket.on('pulls', function (data) {
      var repositoriesUrl = data || user.repos_url;

      // Reset old pull to grant possibility to change
      // the source of the PR (orga, teams, personnal)
      github.resetPulls();

      clearTimeout(timeout);

      (function poll() {
        github.repositories(repositoriesUrl)
          .then(function (repositories) {
            async.each(repositories,
              function (repository, callback) {
                github.pulls(repository)
                  .then(github.statuses)
                  .then(function () {
                    callback();
                    github.issues(repository);
                  })
                  .catch(function (error) {
                    callback(error);
                  });
            }, function (error) {
              if (error) {
                return Promise.reject(error);
              }

              github.removeClosedPulls();
            });
          })
          .catch(function (error) {
            console.error(error);
        });

        timeout = setTimeout(poll, pollTimeout);
      })();
    });

    github.organizations(user)
      .then(function(organizations) {
        _.forEach(organizations, function (organization) {
          github.teams(organization);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  });
};
