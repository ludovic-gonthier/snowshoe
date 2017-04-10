import _ from 'lodash';

import {
  receivedPulls,
  receivedPullsIssues,
  receivedPullsReviews,
  receivedPullsStatuses,
} from '../../client/actions';
import config from '../../config';
import rabbit from '../../common/rabbit';
import {
  issues as fetchIssues,
  pulls as fetchPulls,
  repositories as fetchRepositories,
  reviews as fetchReviews,
  statuses as fetchStatuses,
} from '../../common/github/fetcher';
import rateNotifier from '../../common/github/rate-notifier';

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
        .then((pulls) => pulls.length && { pulls, repository }),
    ),
  );
}

function handleStatuses(statuses, token) {
  const filtered = statuses
    .filter((value) => !!value)
    .filter((status) => !!status.json);

  if (filtered.length) {
    producer(JSON.stringify(receivedPullsStatuses(
      filtered.map((status) => status.json),
      token,
    )));
  }

  return filtered.pop() || {};
}

function handleIssues(issues, token) {
  if (issues.json && issues.json.length) {
    producer(JSON.stringify(receivedPullsIssues(issues.json, token)));
  }

  return issues;
}

function handleReviews(reviews, token) {
  const filtered = reviews
    .filter((value) => !!value)
    .filter((review) => !!review.json);

  if (filtered.length) {
    producer(JSON.stringify(receivedPullsReviews(
      filtered.map((review) => review.json),
      token,
    )));
  }

  return filtered.pop() || {};
}

function handleStatusesAndIssues(promisesResults, token) {
  if (!promisesResults.length) {
    return Promise.resolve([]);
  }

  return Promise.all(
    promisesResults.map((result) => Promise.all([
      fetchStatuses(token, result.pulls),
      fetchIssues(token, result.repository.issues_url),
      fetchReviews(token, result.pulls),
    ]).then((data) => [
      handleStatuses(data[0], token),
      handleIssues(data[1], token),
      handleReviews(data[2], token),
    ]))
  );
}

function handleRate(results, token) {
  const headers = results
    .filter((data) => !!data && !!data.headers && !!data.headers['x-ratelimit-remaining'])
    .map((data) => data.headers)
    .concat([{ 'x-ratelimit-remaining': 5000 }])
    .sort((a, b) => a['x-ratelimit-remaining'] < b['x-ratelimit-remaining'])
    .pop();

  rateNotifier(token, { headers });

  return results;
}

export default function pullsConsumer(token, url) {
  return fetchRepositories(token, url)
    .then((data) => handleRepositoriesAndPulls(data.json, token))
    .then((promisesResults) => promisesResults.filter((result) => !!result))
    .then((promiseResults) => handleStatusesAndIssues(promiseResults, token))
    .then((results) => handleRate(results[0] || [], token));
}
