import _ from 'lodash';

import { rabbit } from '../common/rabbit';
import { config } from '../config';
import {
  issues,
  pulls,
  organizations,
  repositories,
  statuses,
  teams,
} from '../common/github/fetcher';

const producer = _.curry(rabbit.produce)('snowshoe', 'response');

const errorHandler = (error) => console.dir(error);

const handlers = {
  organizations: (token) => organizations(token).then((data) => producer(JSON.stringify({
    type: 'organizations',
    token,
    data,
  }))),
  pulls: (token, url) => repositories(token, url)
    .then(repos => repos.forEach((repository) => pulls(token, repository.pulls_url)
      .then(pullsObject => {
        producer(JSON.stringify({
          type: 'pulls',
          token,
          data: {
            pulls: pullsObject,
            repo: repository.full_name,
            sort: {
              key: config.get('snowshoe.pulls.sort.key'),
              direction: config.get('snowshoe.pulls.sort.direction'),
            },
          },
        }));

        if (pullsObject.length) {
          Promise.all([
            statuses(token, pullsObject),
            issues(token, repository.issues_url),
          ]).then((data) => {
            ['pulls:status', 'pulls:issues'].forEach((type, index) => {
              if (data[index].length) {
                producer(JSON.stringify({
                  type,
                  token,
                  data: data[index],
                }));
              }
            });
          }).catch(errorHandler);
        }
      }).catch(errorHandler)
    ))
    .catch(errorHandler),
  teams: (token, login) => teams(token, login).then(data => producer(JSON.stringify({
    type: 'teams',
    token,
    data,
  }))),
};
rabbit.consume('request', 'snowshoe.request', (message) => {
  const { type, data, token } = JSON.parse(message.content.toString());

  if (type in handlers) {
    return handlers[type](token, data);
  }

  return console.error(`Unhandled type "${type}"`);
});
