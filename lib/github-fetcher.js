'use strict';

var _ = require('lodash');

var regexp = {
  number: /\{\/number\}/
};

module.exports = function (socket, request) {
  var pulls = {old: [], new: []};

  var notifyRate = function (data) {
    socket.emit('rate', {
      'limit': data.headers['x-ratelimit-limit'],
      'remaining': data.headers['x-ratelimit-remaining'],
      'reset': data.headers['x-ratelimit-reset']
    });

    return Promise.resolve(data.json);
  };

  return {
    organizations: function (user) {
      return new Promise(function(resolve, reject) {
        // Initiliaze Orgnaizations and Teams
        request.call(user.organizations_url)
          .then(notifyRate)
          .then(function (organizations) {
            socket.emit('organizations', organizations);

            resolve(organizations);
          })
          .catch(function (error) {
            reject(error);
        });
      });
    },
    teams: function (organization) {
      var url = [
        request.GITHUB_BASE_URL,
        'orgs',
        organization.login,
        'teams'
      ].join('/');

      return new Promise(function(resolve, reject) {
        request.call(url)
          .then(notifyRate)
          .then(function (teams) {
            socket.emit('teams', teams);

            resolve(teams);
          })
          .catch(function (error) {
            reject(error);
        });
      });
    },
    repositories: function (url) {
      return new Promise(function(resolve, reject) {
        request.call(url)
          .then(notifyRate)
          .then(function (repositories) {
            pulls.new = [];

            resolve(repositories);
          }.bind(this))
          .catch(function (error) {
            reject(error);
          });
      });
    },
    pulls: function (repository, callback) {
      return new Promise(function(resolve, reject) {
        request.call(repository.pulls_url.replace(regexp.number, ''))
          .then(notifyRate)
          .then(function (pullRequests) {
            if (pullRequests.length !== 0) {
              pullRequests = _.filter(pullRequests, function (pull) {
                return pull.state && !pull.locked;
              });

              pulls.new = pulls.new.concat(_.map(pullRequests, 'id'));

              socket.emit('pulls', pullRequests);
            }

            resolve(pullRequests);
          })
          .catch(function (error) {
            console.error(error);
            reject(error);
        });
      });
    },
    issues: function (repository) {
      return new Promise(function (resolve, reject) {
        request.call(repository.issues_url.replace(regexp.number, ''))
          .then(notifyRate)
          .then(function (issues) {
            var filtered = _.filter(issues, function (issue) {
              return 'pull_request' in issue;
            });

            if (filtered.length) {
              socket.emit('pulls:issues', filtered);
            }

            resolve(issues);
          })
          .catch(function (error) {
            reject(error);
        });
      });
    },
    statuses: function () {},
    resetPulls: function () {
      pulls.new = [];
    },
    removeClosedPulls: function () {
      var deleted = _.difference(pulls.old, pulls.new);
      if (deleted.length) {
        socket.emit('pulls:delete', deleted);
      }

      pulls.old = pulls.new.slice(0);
    }
  };
};
