import _ from 'lodash';

import config from '../../config';
import formatter from './url-formatter';
import requester from './request';

export function organizations(token) {
  return requester(token)
    .paginate(formatter('/user/orgs', { per_page: 100 }), 'organization')
    .then(data => Promise.resolve(data));
}

export function teams(token, login) {
  return requester(token)
    .paginate(formatter(`orgs/${login}/teams`, { per_page: 100 }), 'team')
    .then(data => Promise.resolve(data));
}

export function repositories(token, url) {
  return requester(token)
    .paginate(formatter(url, { per_page: 100 }), 'repository')
    .then(data => Promise.resolve(data));
}

export function issues(token, url) {
  return requester(token)
    .paginate(formatter(url, { per_page: 100 }), 'issue')
    .then(data => Object.assign(
      {},
      data,
      { json: _.filter(data.json, issue => 'pull_request' in issue) },
    ));
}

export function statuses(token, pullsObject) {
  return Promise.all(pullsObject.map(pull =>
    requester(token)
      .call(`${pull.base.repo.url}/commits/${pull.head.sha}/status`, 'status')
      .then((data) => {
        const status = data.json;

        if (_.has(status, 'statuses') && status.statuses.length) {
          return Object.assign(
            {},
            data,
            {
              json: Object.assign(
                {},
                status,
                { pull_request: { id: pull.id } },
              ),
            },
          );
        }

        return null;
      })));
}

export function pulls(token, url) {
  return requester(token)
    .paginate(formatter(url, { per_page: 100 }), 'pull')
    .then(data => Promise.resolve(
      Object.assign(
        {},
        data,
        { json: [].concat(data.json)
            .filter(pull => !pull.locked)
            .map(pull => Object.assign(
              {},
              pull,
              { isTitleDisplayed: config.get('snowshoe.display_pr_title') },
            )),
        },
      ),
    ));
}
