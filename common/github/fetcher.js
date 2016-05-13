import _ from 'lodash';
import async from 'async';

import { default as formatter } from './url-formatter';
import { notifier } from './rate-notifier';
import { default as requester } from './request';

import { config } from '../../config';

export function organizations(token) {
  return requester(token)
    .paginate(formatter('/user/orgs', { per_page: 100 }), 'organization')
    .then(data => Promise.resolve(notifier(token, data)))
    .then(data => Promise.resolve(data.json))
    .catch(error => {
      console.error(error); // eslint-disable-line no-console

      return Promise.resolve([]);
    });
}

export function teams(token, login) {
  return requester(token)
    .paginate(formatter(`orgs/${login}/teams`, { per_page: 100 }), 'team')
    .then(data => Promise.resolve(notifier(token, data)))
    .then(data => Promise.resolve(data.json))
    .catch(error => {
      console.error(error); // eslint-disable-line no-console

      return Promise.resolve([]);
    });
}

export function repositories(token, url) {
  return requester(token)
    .paginate(formatter(url, { per_page: 100 }), 'repository')
    .then(data => Promise.resolve(notifier(token, data)))
    .then(data => Promise.resolve(data.json));
}

export function issues(token, url) {
  return requester(token)
    .paginate(formatter(url, { per_page: 100 }), 'issue')
    .then(data => Promise.resolve(notifier(token, data)))
    .then(data => Promise.resolve(_.filter(data.json, issue => 'pull_request' in issue)));
}

export function statuses(token, pullsObject) {
  const results = [];

  return new Promise((resolve, reject) => {
    async.each(pullsObject, (pull, callback) => {
      requester(token)
        .call(formatter(pull.statuses_url, { per_page: 1 }), 'status')
        .then(data => Promise.resolve(notifier(token, data)))
        .then(data => {
          const status = data.json;

          if (status.length) {
            results.push(Object.assign({}, status[0], { pull_request: { id: pull.id } }));
          }

          callback();
        })
        .catch(error => callback(error));
    }, error => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function pulls(token, url) {
  return requester(token)
    .paginate(formatter(url, { per_page: 100 }), 'pull')
    .then(data => Promise.resolve(notifier(token, data)))
    .then(data => Promise.resolve(
      [].concat(data.json)
        .filter(pull => !pull.locked)
        .map(pull => Object.assign(
          {},
          pull,
          { isTitleDisplayed: config.get('snowshoe.display_pr_title') }
        ))
      )
    );
}
