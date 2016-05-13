import _ from 'lodash';

import { rabbit } from '../../common/rabbit';
import { config } from '../../config';
import {
  issues as fetchIssues,
  pulls as fetchPulls,
  repositories as fetchRepositories,
  statuses as fetchStatuses,
} from '../../common/github/fetcher';

const producer = _.curry(rabbit.produce)('snowshoe', 'response');

const pullSortConfiguration = {
  key: config.get('snowshoe.pulls.sort.key'),
  direction: config.get('snowshoe.pulls.sort.direction'),
};

function handleRepositoriesAndPulls(repositories, token) {
  return Promise.all(
    repositories.map(
      (repository) => fetchPulls(token, repository.pulls_url)
        .then((pulls) => {
          producer(JSON.stringify({
            type: 'pulls',
            token,
            data: {
              pulls,
              repo: repository.full_name,
              sort: pullSortConfiguration,
            },
          }));

          return pulls;
        })
        .then((pulls) => pulls.length && { pulls, repository })
    )
  );
}

function handleStatuses(statuses, token) {
  if (!statuses.length) {
    return;
  }

  producer(JSON.stringify({
    type: 'pulls:status',
    token,
    data: statuses,
  }));
}

function handleIssues(issues, token) {
  if (!issues.length) {
    return;
  }

  producer(JSON.stringify({
    type: 'pulls:issues',
    token,
    data: issues,
  }));
}

function handleStatusesAndIssues(promisesResults, token) {
  if (!promisesResults.length) {
    return Promise.resolve();
  }

  const promises = promisesResults.map((result) => Promise.all([
    fetchStatuses(token, result.pulls),
    fetchIssues(token, result.repository.issues_url),
  ]).then((data) => {
    handleStatuses(data[0], token);
    handleIssues(data[1], token);
  }));

  return Promise.all(promises);
}

export function pullsConsumer(token, url) {
  return fetchRepositories(token, url)
    .then((repositories) => handleRepositoriesAndPulls(repositories, token))
    .then((promisesResults) => promisesResults.filter((result) => !!result))
    .then((promiseResults) => handleStatusesAndIssues(promiseResults, token));
}
