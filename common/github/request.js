import request from 'request-promise-native';
import isEmpty from 'lodash/isEmpty';
import partialRight from 'lodash/partialRight';
import get from 'lodash/get';

import etagHandler from './etag-handler';
import filter from './result-filter';

const regexp = {
  pagination: /<(.*?)>;\s+rel="next"/g,
};

/**
 * Handle response which statusCode is not 2XX or 3XX
 *
 * @param response The response object
 * @return response If no error
 * @return Error if statusCode not supported
 */
function handleErrorResponse(response) {
  if (response.statusCode < 200 || response.statusCode >= 400) {
    throw new Error(`
      Github API Error:
      ${response.statusCode}: ${response.statusMessage}.
      ${response.body}
    `);
  }

  return response;
}

/**
 */
function handleSuccessResponse({ body, headers = {}, statusCode }, cached, type, storageKey) {
  if (statusCode === 304) {
    if (isEmpty(cached) === true) {
      throw new Error('Not-Modified header with empty cached ETag.');
    }

    return {
      headers,
      json: cached.json
    };
  }

  const json = filter(body, type);

  if (isEmpty(headers.etag) === true) {
    return { headers, json };
  }

  return etagHandler.store(storageKey, json, headers)
    .then(() => ({ headers, json }));
}

/**
 */
function call(url, type, token) {
  const storageKey = `${url}::${token}`;

  return etagHandler.retrieve(storageKey)
    .then((cached) =>
      request.get(url, {
        headers: {
          'If-None-Match': get(cached, 'etag', ''),
          'User-Agent': 'application-snowshoe',
          Accept: 'application/vnd.github.black-cat-preview+json',
          Authorization: `token ${token}`,
        },
        json: true,
        resolveWithFullResponse: true,
      })
      .then(handleErrorResponse)
      .then(partialRight(handleSuccessResponse, cached, type, storageKey))
    );
}

/**
 */
function paginate(url, type, token, result = { json: [] }) {
  return call(url, type, token)
    .then((data) => {
      const response = Object.assign(
        {},
        result,
        {
          json: result.json.concat(data.json),
          headers: get(result, 'headers', data.headers),
        }
      );

      if (get(data, 'headers.link', '') !== '') {
        const next = regexp.pagination.exec(data.headers.link);

        if (next !== null) {
          return paginate(next[1], type, token, response);
        }
      }

      // Return when we have no next page
      return response;
    });
} export { call,
  paginate,
};
