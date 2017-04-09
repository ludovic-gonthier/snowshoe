import request from 'request-promise-native';

import query from './query';

const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

const formatter = {
  rate: ({ headers, body }) => {
    if (headers['x-ratelimit-remaining'] !== undefined) {
      return {
        data: Object.assign(
          {},
          body.data,
          {
            rate: {
              limit: headers['x-ratelimit-limit'],
              remaining: headers['x-ratelimit-remaining'],
              reset: headers['x-ratelimit-reset'],
            },
          }
        ),
      };
    }

    return body;
  },
};

export default function call(token, operationName, variables) {
  return request
    .post(GRAPHQL_ENDPOINT, {
      body: {
        operationName,
        query,
        variables: variables || {},
      },
      headers: {
        Authorization: `bearer ${token}`,
        'User-Agent': 'application-snowshoe',
        'If-None-Match': '0daf98733a84254406361792ea40222e',
      },
      json: true,
      resolveWithFullResponse: true,
    })
    .catch(console.error);
}

const token = '';

call(token, 'viewer')
  .then(formatter.rate)
  .then((body) => call(token, 'organizations', { user_login: body.data.viewer.login }))
  .then(formatter.rate)
  .then(console.dir);
