'use strict';

var packer = require('jsonpack');

module.exports = function () {
  /**
   * ETags store
   * @type Object
   */
  var etags = {};

  return {
    /**
     * Store the ETag of the headers array
     *
     * @param  string id        ID in which to store the ETag
     * @param  array  headers   The response headers
     */
    store: function (id, json, headers) {
      if (headers['etag']) {
        etags[id] = {
          etag: headers['etag'],
          json: packer.pack(json)
        };
      }
    },
    /**
     * Return the stored ETag for the given ID
     *
     * @param  string id           ID of the stored ETag
     * @return string|undefined    The requested ETag or undefined otherwise
     */
    getEtag: function (id) {
      if (etags[id]) {
        return etags[id].etag;
      }

      return undefined;
    },
    /**
     * Returns the stored JSON for the given ID
     *
     * @param  string id         ID of the stored ETag
     * @return json|undefined    The request JSON or undefined otherwise
     */
    getJson: function (id) {
      if (etags[id]) {
        return packer.unpack(etags[id].json);
      }

      return undefined;
    }
  };
}
