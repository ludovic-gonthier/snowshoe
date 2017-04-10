import Redis from 'ioredis';

import config from '../../config';

let storage;

if (process.env.NODE_ENV !== 'test') {
  storage = new Redis({ port: config.get('redis.port'),
    host: config.get('redis.host'),
    password: config.get('redis.password'),
    db: 1,
  });

  storage.on('error', (error) => console.error(error.stack)); // eslint-disable-line no-console
}

export default {
  /**
   * Store the ETag value and the page JSON if present in the headers
   *
   * @param  string id        ID in which to store the ETag
   * @param  json   json      The response json parsed body
   * @param  array  headers   The response headers
   */
  store(id, json, headers) {
    if (headers.etag) {
      const object = {
        _id: id,
        etag: headers.etag,
        json,
        inserted_at: Date.now(),
      };

      storage.set(id, JSON.stringify(object), 'EX', 3600)
        .catch((error) => console.error(error)); // eslint-disable-line no-console
    }
  },

  /**
   * Return the stored ETag for the given ID
   *
   * @param  string id           ID of the stored ETag
   * @return json|undefined      The requested ETag object or undefined
   */
  getEtag(id, callback) {
    storage
      .get(id)
      .then((object) => callback(JSON.parse(object)))
      .catch((error) => console.error(error)); // eslint-disable-line no-console
  },
};
