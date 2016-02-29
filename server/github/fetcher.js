import _ from 'lodash';
import async from 'async';
import Promise from 'promise';

import { config } from '../../config';
import { default as formatter } from './url-formatter';
import { default as rateNotifier } from './rate-notifier';
import { default as requester } from './request';

export default function (socket, accessToken) {
  const pulls = { old: [], new: [] };
  const request = requester(accessToken);
  const notifier = rateNotifier(socket);

  return {
    organizations() {
      return request
        .paginate(formatter('/user/orgs', { per_page: 100 }), 'organization')
        .then(notifier)
        .then(data => {
          /* eslint-disable no-console */
          socket.emit('organizations', data.json, (error) => console.error(error));
          /* eslint-enable no-console */

          return Promise.resolve(data.json);
        });
    },
    teams(organizationLogin) {
      const url = [
        'orgs',
        organizationLogin,
        'teams',
      ].join('/');

      return request
        .paginate(formatter(url, { per_page: 100 }), 'team')
        .then(notifier)
        .then(data => {
          socket.emit('teams', data.json);

          return Promise.resolve(data.json);
        });
    },
    repositories(url) {
      return request
        .paginate(formatter(url, { per_page: 100 }), 'repository')
        .then(notifier)
        .then(data => Promise.resolve(data.json));
    },
    pulls(repository) {
      return request
        .paginate(formatter(repository.pulls_url, { per_page: 100 }), 'pull')
        .then(notifier)
        .then(data => {
          let pullRequests = data.json;

          if (pullRequests.length !== 0) {
            pullRequests = _.filter(pullRequests, pull => !pull.locked);
            pullRequests = _.map(pullRequests, pull => Object.assign(
              pull,
              { isTitleDisplayed: config.get('snowshoe.display_pr_title') }
            ));

            pulls.new = pulls.new.concat(_.map(pullRequests, 'id'));

            socket.emit('pulls', pullRequests);
          }

          return Promise.resolve(pullRequests);
        });
    },
    issues(repository) {
      return request
        .paginate(formatter(repository.issues_url, { per_page: 100 }), 'issue')
        .then(notifier)
        .then(data => {
          const issues = data.json;
          const filtered = _.filter(issues, issue => 'pull_request' in issue);

          if (filtered.length) {
            socket.emit('pulls:issues', filtered);
          }

          return Promise.resolve(filtered);
        });
    },
    statuses(pullsObject) {
      return new Promise((resolve, reject) => {
        async.each(pullsObject, (pull, callback) => {
          request.call(formatter(pull.statuses_url, { per_page: 1 }), 'status')
            .then(notifier)
            .then(data => {
              const statuses = data.json;

              if (statuses.length) {
                statuses[0].pull_request = { id: pull.id };
                socket.emit('pulls:status', statuses[0]);
              }

              callback();
            })
            .catch(error => callback(error));
        }, error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    },
    resetPulls() {
      pulls.new.length = 0;
    },
    removeClosedPulls() {
      const deleted = _.difference(pulls.old, pulls.new);
      if (deleted.length) {
        socket.emit('pulls:delete', deleted);
      }

      pulls.old = pulls.new.slice(0);
      pulls.new.length = 0;
    },
  };
}
