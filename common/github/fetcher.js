import _ from 'lodash';

import config from '../../config';
import formatter from './url-formatter';
import { call, paginate } from './request';

export function organizations(token) {
  return paginate(
    formatter('/user/orgs', { per_page: 100 }),
    'organization',
    token
  );
}

export function teams(token, login) {
  return paginate(
    formatter(`orgs/${login}/teams`, { per_page: 100 }),
    'team',
    token
  );
}

export function repositories(token, url) {
  return paginate(
    formatter(url, { per_page: 100 }),
    'repository',
    token
  );
}

export function issues(token, url) {
  return paginate(
    formatter(url, { per_page: 100 }),
    'issue',
    token
  ).then((data) => Object.assign(
    {},
    data,
    { json: _.filter(data.json, (issue) => 'pull_request' in issue) },
  ));
}

export function statuses(token, pullsObject) {
  return Promise.all(pullsObject.map((pull) =>
    call(
      `${pull.base.repo.url}/commits/${pull.head.sha}/status`,
      'status',
      token
    ).then((data) => {
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
  return paginate(
    formatter(url, { per_page: 100 }),
    'pull',
    token
  ).then((data) => Promise.resolve(
    Object.assign(
      {},
      data,
      { json: [].concat(data.json)
        .filter((pull) => !pull.locked)
        .map((pull) => Object.assign(
          {},
          pull,
          { isTitleDisplayed: config.get('snowshoe.display_pr_title') },
        )),
      },
    ),
  ));
}

export function reviews(token, pullsObject) {
  return Promise.all(pullsObject.map((pull) =>
    call(
      `${pull.base.repo.url}/pulls/${pull.number}/reviews`,
      'review',
      token
    ).then((data) => Object.assign(
      {},
      data,
      {
        json: {
          pull_request: { id: pull.id },
          reviews: data.json,
        },
      },
    ))
  ));
}
