import _ from 'lodash';

import {
  receivedPulls,
  receivedPullsIssues,
  receivedPullsStatuses,
} from '../../client/actions';
import { rabbit } from '../../common/rabbit';
import { config } from '../../config';
import {
  issues as fetchIssues,
  pulls as fetchPulls,
  repositories as fetchRepositories,
  statuses as fetchStatuses,
} from '../../common/github/fetcher';
import { rateNotifier } from '../../common/github/rate-notifier';

const producer = _.curry(rabbit.produce)('snowshoe', 'response');

const pullSortConfiguration = {
  key: config.get('snowshoe.pulls.sort.key'),
  direction: config.get('snowshoe.pulls.sort.direction'),
};

function handleRepositoriesAndPulls(repositories, token) {
  return Promise.all(
    repositories.map(
      (repository) => fetchPulls(token, repository.pulls_url)
        .then((data) => {
          if (data.json.length) {
            producer(JSON.stringify(receivedPulls({
              pulls: data.json,
              repo: repository.full_name,
              sort: pullSortConfiguration,
            }, token)));
          }

          return data.json;
        })
        .then((pulls) => pulls.length && { pulls, repository })
    )
  );
}

function handleStatuses(statuses, token) {
  const filtered = statuses.filter((value) => !!value);

  if (filtered.length) {
    producer(JSON.stringify(receivedPullsStatuses(
      filtered.map((status) => status.json),
      token
    )));
  }

  return filtered[filtered.length - 1];
}

function handleIssues(issues, token) {
  if (issues.json.length) {
    producer(JSON.stringify(receivedPullsIssues(issues.json, token)));
  }

  return issues;
}

function handleStatusesAndIssues(promisesResults, token) {
  if (!promisesResults.length) {
    return Promise.resolve([]);
  }

  const promises = promisesResults.map((result) => Promise.all([
    fetchStatuses(token, result.pulls),
    fetchIssues(token, result.repository.issues_url),
  ]).then((data) => [
    handleStatuses(data[0], token),
    handleIssues(data[1], token),
  ]));

  return Promise.all(promises);
}

function handleRate(promisesResults, token) {
  const headers = promisesResults
    .reduce((data, result) =>
      data.concat(result.filter((value) => !!value).map((value) => value.headers))
    , [])
    .filter((value) => !!value)
    .reduce((rate, data) => {
      if (!rate || data['x-ratelimit-remaining'] < rate['x-ratelimit-remaining']) {
        return data;
      }

      return rate;
    }, {});

  if (!_.isEmpty(headers)) {
    rateNotifier(token, { headers });
  }

  return promisesResults;
}

export function pullsConsumer(token, url) {
  return fetchRepositories(token, url)
    .then((data) => handleRepositoriesAndPulls(data.json, token))
    .then((promisesResults) => promisesResults.filter((result) => !!result))
    .then((promiseResults) => handleStatusesAndIssues(promiseResults, token))
    .then((promisesResults) => handleRate(promisesResults, token));
}
