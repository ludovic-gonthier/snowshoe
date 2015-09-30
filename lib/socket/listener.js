'use strict';

var async = require('async');
var _ =  require('lodash');
var Promise =  require('promise');

var fetcher = require('../github/fetcher');
var Poller = require('../poller');

var poller = Poller((process.env.GITHUB_POLL_TIMEOUT || 60) * 1000);
poller.callback = function (data, socket) {
  var github = data.fetcher;

  return new Promise(function (resolve, reject) {
    return github.repositories(data.url)
      .then(function (repositories) {
        async.each(repositories, function (repository, callback) {
          github.pulls(repository)
            .then(function (pulls) {
              callback();

              if (pulls.length) {
                github.statuses(pulls).catch(callback);
                github.issues(repository).catch(callback);
              }
            }).catch(function (error) {
              console.error(error);
              callback();
            });
        }, function (error) {
          if (error) {
            return console.error(error);
          }

          github.removeClosedPulls();
          resolve();
        });
      }).catch(reject);
  });
}

module.exports = function (socket) {
  var timeout = null;
  var github;

  socket.on('disconnect', function () {
    poller.unregister(socket);
    socket = null;
    github = null;
  });

  socket.on('user', function (data) {
    var user = data.user;
    var token = data.accessToken;
    github = fetcher(socket, token);

    socket.on('pulls', function (data) {
      var object = {
        'url': data,
        'fetcher': github
      };

      poller.register(object, socket);
      poller.callback(object, socket);
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
