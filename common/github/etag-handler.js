import Redis from 'ioredis';

import config from '../../config';

const STORAGE_TTL = 3600; // One hour storage

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
   * @return Promise
   */
  store(id, json, headers) {
    return storage.set(
      id,
      JSON.stringify({
        _id: id,
        etag: headers.etag,
        json,
        inserted_at: Date.now(),
      }),
      'EX',
      STORAGE_TTL
    );
  },

  /**
   * Return the stored ETag for the given ID
   *
   * @param  string id           ID of the stored ETag
   * @return Promise
   */
  retrieve(id) {
    return storage
      .get(id)
      .then((object) => JSON.parse(object));
  },
};
