'use strict';

var _ = require('lodash');
var async = require('async');
var Promise = require('promise');

var formatter = require('./url-formatter');
var rateNotifier = require('./rate-notifier');
var requester = require('./request');

module.exports = function (socket, accessToken) {
  var pulls = {old: [], new: []};
  var request = requester(accessToken);
  var notifier = rateNotifier(socket);

  return {
    organizations: function () {
      return new Promise(function(resolve, reject) {
        // Initiliaze Orgnaizations and Teams
        request.paginate(formatter('/user/orgs', {per_page: 100})) // eslint-disable-line camelcase
          .then(notifier)
          .then(function (data) {
            socket.emit('organizations', data.json);

            resolve(data.json);
          })
          .catch(function (error) {
            reject(error);
        });
      });
    },
    teams: function (organizationLogin) {
      var url = [
        'orgs',
        organizationLogin,
        'teams'
      ].join('/');

      return new Promise(function(resolve, reject) {
        request.paginate(formatter(url, {per_page: 100})) // eslint-disable-line camelcase
          .then(notifier)
          .then(function (data) {
            socket.emit('teams', data.json);

            resolve(data.json);
          })
          .catch(function (error) {
            reject(error);
        });
      });
    },
    repositories: function (url) {
      return new Promise(function(resolve, reject) {
        request.paginate(formatter(url, {per_page: 100})) // eslint-disable-line camelcase
          .then(notifier)
          .then(function (data) {
            pulls.new = [];

            resolve(data.json);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
    pulls: function (repository) {
      return new Promise(function(resolve, reject) {
        request.paginate(formatter(repository.pulls_url, {per_page: 100})) // eslint-disable-line camelcase
          .then(notifier)
          .then(function (data) {
            var pullRequests = data.json;


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
            reject(error);
        });
      });
    },
    issues: function (repository) {
      return new Promise(function (resolve, reject) {
        request.paginate(formatter(repository.issues_url, {per_page: 100})) // eslint-disable-line camelcase
          .then(notifier)
          .then(function (data) {
            var issues = data.json;
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
          request.call(formatter(pull.statuses_url, {per_page: 1}))  // eslint-disable-line camelcase
            .then(notifier)
            .then(function (data) {
              var statuses = data.json;

              if (statuses.length) {
                statuses[0].pull_request = {id: pull.id}; // eslint-disable-line camelcase
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
