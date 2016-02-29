import Nedb from 'nedb';
import path from 'path';

import { config } from '../../config';

const file = path.join(__dirname, '..', '..', 'cache', 'etags.db');

const db = new Nedb({ filename: file, autoload: true });

db.ensureIndex({ fieldname: '_id', unique: true });

// Compact database every 10 poll
db.persistence.setAutocompactionInterval(config.get('snowshoe.refresh.rate') * 10);

/**
 * Purge db from inserted value of the last day
 */
function purge() {
  const now = new Date();
  const dayBefore = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  db.remove({ $where() {
    return this.inserted_at <= dayBefore.getTime();
  } }, { multi: true });

  setTimeout(purge, 3600000); // Poll every hour
}

purge();

export default {
  /**
   * Store the ETag value and the page JSON if present in the headers
   *
   * @param  string id        ID in which to store the ETag
   * @param  json   json      The response json parsed body
   * @param  array  headers   The response headers
   */
  store(id, json, headers) {
    let object;

    if (headers.etag) {
      object = {
        _id: id,
        etag: headers.etag,
        json,
        inserted_at: Date.now(),
      };

      db.remove({ _id: id });
      db.insert(object, error => {
        if (error) {
          throw error;
        }
      });
    }
  },

  /**
   * Return the stored ETag for the given ID
   *
   * @param  string id           ID of the stored ETag
   * @return json|undefined      The requested ETag object or undefined
   */
  getEtag(id, callback) {
    db.findOne({ _id: id }, (error, object) => {
      if (error) {
        throw error;
      }

      callback(object);
    });
  },
};
