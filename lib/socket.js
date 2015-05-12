'use strict';

var _ = require('lodash');
var async = require('async');
var url = require('url');
var request = require('./github-request');
var fetcher = require('./github-fetcher');

module.exports = function (server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    var timeout = null;

    socket.on('disconnect', function () {
      if (timeout) {
        clearTimeout(timeout);
      }
    });

    socket.on('user', function (data) {
      var user = data.user;
      var github = fetcher(socket, request(data.accessToken));

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

          timeout = setTimeout(poll, 60000);
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
  });
}

