'use strict';

var async = require('async');
var _ = require('lodash');
var Promise = require('promise');
var requester = require('./github-request');
var regexp = {
  number: /\{\/number\}/,
  sha: /\{\/sha\}/
};

module.exports = function (socket, accessToken) {
  var pulls = {old: [], new: []};
  var notifyRate = function (data) {
    socket.emit('rate', {
      'limit': data.headers['x-ratelimit-limit'],
      'remaining': data.headers['x-ratelimit-remaining'],
      'reset': data.headers['x-ratelimit-reset']
    });

    return Promise.resolve(data.json);
  };
  var request = requester(accessToken);

  return {
    organizations: function (user) {
      return new Promise(function(resolve, reject) {
        var url = [
          requester.GITHUB_BASE_URL,
          'user',
          'orgs'
        ].join('/');

        // Initiliaze Orgnaizations and Teams
        request.call(url, {per_page: 100, paginate: true})
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
    teams: function (organizationLogin) {
      var url = [
        requester.GITHUB_BASE_URL,
        'orgs',
        organizationLogin,
        'teams'
      ].join('/');

      return new Promise(function(resolve, reject) {
        request.call(url, {per_page: 100, paginate: true})
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
        request.call(url, {per_page: 100, paginate: true})
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

        request.call(repository.pulls_url.replace(regexp.number, ''), {per_page: 100, paginate: true})
          .then(notifyRate)
          .then(function (pullRequests) {
            if (pullRequests.length !== 0) {
              pullRequests = _.filter(pullRequests, function (pull) {
                return pull.state && !pull.locked;
              });
              pullRequests = _.map(pullRequests, function (pull) {
                pull.isTitleDisplayed = process.env.SNOWSHOE_APP_DISPLAY_PR_TITLE || false;

                return pull;
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
        request.call(repository.issues_url.replace(regexp.number, ''), {per_page: 100, paginate: true})
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
    statuses: function (pulls) {
      return new Promise(function (resolve, reject) {
        async.each(pulls, function (pull, callback) {
          request.call(pull.statuses_url.replace(regexp.sha, ''), {per_page: 1, paginate: false})
            .then(notifyRate)
            .then(function (statuses) {
              if (statuses.length) {
                statuses[0].pull_request = {id: pull.id};
                socket.emit('pulls:status', statuses[0]);
              }

              callback();
            })
            .catch(function (error) {
              callback(error);
          });
        }, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    },
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
