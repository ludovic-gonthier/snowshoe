'use strict';

var async = require('async');

var fetcher = require('../github/fetcher');

var pollTimeout = (process.env.GITHUB_POLL_TIMEOUT || 60) * 1000;

module.exports = function (socket) {
  var timeout = null;

  socket.on('disconnect', function () {
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  socket.on('user', function (data) {
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
                  .then(function (pulls) {
                    callback();

                    if (pulls.length) {
                      github.statuses(pulls);
                      github.issues(repository);
                    }
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
            console.error(error); // eslint-disable-line no-console
        });

        timeout = setTimeout(poll, pollTimeout);
      })();
    });

    github.organizations()
      .catch(function (error) {
        console.error(error); // eslint-disable-line no-console
    });

    socket.on('team', function (organizationLogin) {
      github.teams(organizationLogin);
    });
  });
};
