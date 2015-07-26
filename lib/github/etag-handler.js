'use strict';

var Nedb = require('nedb');
var path = require('path');

var file = path.join(__dirname, '..', '..', 'cache', 'etags.db');

var db = new Nedb({ filename: file, autoload: true });

db.ensureIndex({fieldname: '_id', unique: true});

module.exports = function () {
  return {
    /**
     * Store the ETag value and the page JSON if present in the headers
     *
     * @param  string id        ID in which to store the ETag
     * @param  json   json      The response json parsed body
     * @param  array  headers   The response headers
     */
    store: function (id, json, headers) {
      var object;

      if (headers.etag) {
        object = {
          '_id': id,
          'etag': headers.etag,
          'json': json
        };

        db.remove({_id: id});
        db.insert(object, function (error) {
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
    getEtag: function (id, callback) {
      db.findOne({'_id': id}, function (error, object) {
        if (error) {
          throw error;
        }

        callback(object);
      });
    }
  };
};
