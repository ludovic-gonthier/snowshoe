'use strict';

var Promise = require('promise');

var stubs = {
  etag_handler: {
    getEtag: sinon.stub(),
    store: sinon.spy()
  },
  request: sinon.stub(),
  result_filter: sinon.stub()
};

var request = proxyquire(ROOT_PATH + '/lib/github/request', {
  'request': stubs.request,
  './etag-handler': function () {
      return stubs.etag_handler;
    },
  './result-filter': stubs.result_filter
});

describe('request', function () {
  var token = 'mytoken';
  var url = '/foo';
  var etag = 'myetag';
  var type = 'mytype';
  var options = {
    'headers': {
      'User-Agent': 'request',
      'Authorization': 'token ' + token,
      'If-None-Match': etag
    },
    'url': url
  };

  beforeEach(function () {
    stubs.etag_handler.getEtag.reset();
    stubs.etag_handler.store.reset();
    stubs.request.reset();
    stubs.result_filter.reset();
  });

  describe('.call()', function () {
    it('should return a promise', function () {
      var expected = Promise;
      var current = request('token').call('/foo', 'test');

      expect(current).to.be.an.instanceof(expected);
    });
    it('should reject the promise when the request fails', function () {
      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields({etag: etag});
      stubs.request
        .withArgs(options)
        .yields(new Error('Request fails'));

      return new Promise(function (resolve, reject) {
        request(token).call(url, type)
          .then(reject)
          .catch(resolve);
      });
    });
    it('should reject the promise when the status code is 200 < status && status >= 400', function () {
      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields({etag: etag});
      stubs.request
        .withArgs(options)
        .yields(null, {statusCode: 403}, JSON.stringify('{message: "Authorization fails"'));

      return new Promise(function (resolve, reject) {
        request(token).call(url, type)
          .then(reject)
          .catch(resolve);
      });
    });
    it('should reject the promise when the response body cannot be parsed to JSON', function () {
      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields({etag: etag});
      stubs.request
        .withArgs(options)
        .yields(null, {statusCode: 200});

      return new Promise(function (resolve, reject) {
        request(token).call(url, type)
          .then(reject)
          .catch(resolve);
      });
    });
    it('should resolve the promise', function () {
      var json = {foo: 'bar'};
      var headers = {};
      var expected = {
        json: json,
        headers: headers
      };
      options = {
        'headers': {
          'User-Agent': 'request',
          'Authorization': 'token ' + token
        },
        'url': url
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(undefined);
      stubs.request
        .withArgs(options)
        .yields(null, {headers: headers}, JSON.stringify(json));
      stubs.result_filter
        .withArgs(json, type)
        .returns(json);

      return new Promise(function (resolve, reject) {
        request(token).call(url, type)
          .then(function (data) {
            expect(stubs.result_filter).to.be.called;
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
    it('should stores the response ETag', function () {
      var json = {foo: 'bar'};
      var headers = {};
      var expected = {
        json: json,
        headers: headers
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(undefined);
      stubs.etag_handler.store
        .withArgs(url + token, json, headers);
      stubs.request
        .withArgs(options)
        .yields(null, {headers: headers}, JSON.stringify(json));
      stubs.result_filter
        .withArgs(json, type)
        .returns(json);

      return new Promise(function (resolve, reject) {
        request(token).call(url, type)
          .then(function () {
            expect(stubs.etag_handler.store).to.be.called;

            resolve();
          })
          .catch(reject);
      });
    });
    it('should provide the request header with ETag', function () {
      options = {
        'headers': {
          'User-Agent': 'request',
          'Authorization': 'token ' + token,
          'If-None-Match': etag
        },
        'url': url
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields({etag: etag});
      stubs.request
        .withArgs(options)
        .yields(null, {headers: {}}, JSON.stringify({}));

      return new Promise(function (resolve, reject) {
        request(token).call(url, type)
          .then(function () {
            expect(stubs.request).to.be.called;

            resolve();
          })
          .catch(reject);
      });
    });
    it('should use the stored body if response status code is 304', function () {
      var stored = {
        etag: etag,
        json: {foo: 'bar'}
      };
      var headers = {};
      var response = {
        statusCode: 304,
        headers: headers
      };
      var expected = {
        json: stored.json,
        headers: headers
      };

      options = {
        'headers': {
          'User-Agent': 'request',
          'Authorization': 'token ' + token,
          'If-None-Match': etag
        },
        'url': url
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(stored);
      stubs.request
        .withArgs(options)
        .yields(null, response, JSON.stringify({}));

      return new Promise(function (resolve, reject) {
        request(token).call(url, type)
          .then(function (data) {
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
  });

  describe('.paginate()', function () {
    it('should return a promise', function () {
      var expected = Promise;
      var current = request('token').paginate('/foo', 'test');

      expect(current).to.be.an.instanceof(expected);
    });
    it('should reject the promise when a call fails', function () {
      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields({etag: etag});
      stubs.request
        .withArgs(options)
        .yields(new Error('Request fails'));

      return new Promise(function (resolve, reject) {
        request(token).paginate(url, type)
          .then(reject)
          .catch(resolve);
      });
    });
    it('should handle requests without pagination', function () {
      var json = {foo: 'bar'};
      var headers = {};
      var expected = {
        json: [json],
        headers: headers
      };
      options = {
        'headers': {
          'User-Agent': 'request',
          'Authorization': 'token ' + token
        },
        'url': url
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(undefined);
      stubs.request
        .withArgs(options)
        .yields(null, {headers: headers}, JSON.stringify(json));
      stubs.result_filter
        .withArgs(json, type)
        .returns(json);

      return new Promise(function (resolve, reject) {
        request(token).paginate(url, type)
          .then(function (data) {
            expect(stubs.result_filter).to.be.called;
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
    it('should handle requests with pagination', function () {
      var json = [
        {foo: 'bar'},
        {foo: 'foo'}
      ];
      var nextUrl = url + '?page=2';
      var headers = {
        'link': '<' + nextUrl + '>; rel="next"'
      };
      var expected = {
        json: json,
        headers: headers
      };
      options = {
        'headers': {
          'User-Agent': 'request',
          'Authorization': 'token ' + token
        },
        'url': url
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(undefined);
      stubs.etag_handler.getEtag
        .withArgs(nextUrl + token)
        .yields(undefined);
      stubs.request
        .withArgs(options = {
          'headers': {
            'User-Agent': 'request',
            'Authorization': 'token ' + token
          },
          'url': url
        })
        .yields(null, {headers: headers}, JSON.stringify(json[0]));
      stubs.request
        .withArgs(options = {
          'headers': {
            'User-Agent': 'request',
            'Authorization': 'token ' + token
          },
          'url': nextUrl
        })
        .yields(null, {}, JSON.stringify(json[1]));
      stubs.result_filter
        .withArgs(json[0], type)
        .returns(json[0]);
      stubs.result_filter
        .withArgs(json[1], type)
        .returns(json[1]);

      return new Promise(function (resolve, reject) {
        request(token).paginate(url, type)
          .then(function (data) {
            expect(stubs.result_filter).to.be.called;
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
  });
});
