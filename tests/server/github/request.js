/* global beforeEach, describe, expect, it, proxyquire, ROOT_PATH, sinon */
/* eslint-disable no-unused-expressions */
import Promise from 'promise';

const stubs = {
  etag_handler: {
    getEtag: sinon.stub(),
    store: sinon.spy(),
  },
  request: sinon.stub(),
  result_filter: sinon.stub(),
};

const request = proxyquire(`${ROOT_PATH}/server/github/request`, {
  request: stubs.request,
  './etag-handler': { default: stubs.etag_handler },
  './result-filter': { default: stubs.result_filter },
}).default;

describe('request', () => {
  const token = 'mytoken';
  const url = '/foo';
  const etag = 'myetag';
  const type = 'mytype';
  let options = {
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${token}`,
      'If-None-Match': etag,
    },
    url,
  };

  beforeEach(() => {
    stubs.etag_handler.getEtag.reset();
    stubs.etag_handler.store.reset();
    stubs.request.reset();
    stubs.result_filter.reset();
  });

  describe('.call()', () => {
    it('should return a promise', () => {
      const expected = Promise;
      const current = request('token').call('/foo', 'test');

      expect(current).to.be.an.instanceof(expected);
    });
    it('should reject the promise when the request fails', () => {
      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields({ etag });
      stubs.request
        .withArgs(options)
        .yields(new Error('Request fails'));

      return new Promise((resolve, reject) => {
        request(token).call(url, type)
          .then(reject)
          .catch(resolve);
      });
    });
    it(
      'should reject the promise when the status code is 200 < status && status >= 400',
      () => {
        stubs.etag_handler.getEtag
          .withArgs(url + token)
          .yields({ etag });
        stubs.request
          .withArgs(options)
          .yields(null, { statusCode: 403 }, JSON.stringify('{message: "Authorization fails"'));

        return new Promise((resolve, reject) => {
          request(token).call(url, type)
            .then(reject)
            .catch(resolve);
        });
      }
    );
    it(
      'should reject the promise when the response body cannot be parsed to JSON',
      () => {
        stubs.etag_handler.getEtag
          .withArgs(url + token)
          .yields({ etag });
        stubs.request
          .withArgs(options)
          .yields(null, { statusCode: 200 });

        return new Promise((resolve, reject) => {
          request(token).call(url, type)
            .then(reject)
            .catch(resolve);
        });
      }
    );
    it('should resolve the promise', () => {
      const json = { foo: 'bar' };
      const headers = {};
      const expected = {
        json,
        headers,
      };
      options = {
        headers: {
          'User-Agent': 'request',
          Authorization: `token ${token}`,
        },
        url,
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(undefined);
      stubs.request
        .withArgs(options)
        .yields(null, { headers }, JSON.stringify(json));
      stubs.result_filter
        .withArgs(json, type)
        .returns(json);

      return new Promise((resolve, reject) => {
        request(token).call(url, type)
          .then(data => {
            expect(stubs.result_filter).to.be.called;
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
    it('should stores the response ETag', () => {
      const json = { foo: 'bar' };
      const headers = {};

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(undefined);
      stubs.etag_handler.store
        .withArgs(url + token, json, headers);
      stubs.request
        .withArgs(options)
        .yields(null, { headers }, JSON.stringify(json));
      stubs.result_filter
        .withArgs(json, type)
        .returns(json);

      return new Promise((resolve, reject) => {
        request(token).call(url, type)
          .then(() => {
            expect(stubs.etag_handler.store).to.be.called;

            resolve();
          })
          .catch(reject);
      });
    });
    it('should provide the request header with ETag', () => {
      options = {
        headers: {
          'User-Agent': 'request',
          Authorization: `token ${token}`,
          'If-None-Match': etag,
        },
        url,
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields({ etag });
      stubs.request
        .withArgs(options)
        .yields(null, { headers: {} }, JSON.stringify({}));

      return new Promise((resolve, reject) => {
        request(token).call(url, type)
          .then(() => {
            expect(stubs.request).to.be.called;

            resolve();
          })
          .catch(reject);
      });
    });
    it('should use the stored body if response status code is 304', () => {
      const stored = {
        etag,
        json: { foo: 'bar' },
      };
      const headers = {};
      const response = {
        statusCode: 304,
        headers,
      };
      const expected = {
        json: stored.json,
        headers,
      };

      options = {
        headers: {
          'User-Agent': 'request',
          Authorization: `token ${token}`,
          'If-None-Match': etag,
        },
        url,
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(stored);
      stubs.request
        .withArgs(options)
        .yields(null, response, JSON.stringify({}));

      return new Promise((resolve, reject) => {
        request(token).call(url, type)
          .then(data => {
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
  });

  describe('.paginate()', () => {
    it('should return a promise', () => {
      const expected = Promise;
      const current = request('token').paginate('/foo', 'test');

      expect(current).to.be.an.instanceof(expected);
    });
    it('should reject the promise when a call fails', () => {
      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields({ etag });
      stubs.request
        .withArgs(options)
        .yields(new Error('Request fails'));

      return new Promise((resolve, reject) => {
        request(token).paginate(url, type)
          .then(reject)
          .catch(resolve);
      });
    });
    it('should handle requests without pagination', () => {
      const json = { foo: 'bar' };
      const headers = {};
      const expected = {
        json: [json],
        headers,
      };
      options = {
        headers: {
          'User-Agent': 'request',
          Authorization: `token ${token}`,
        },
        url,
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(undefined);
      stubs.request
        .withArgs(options)
        .yields(null, { headers }, JSON.stringify(json));
      stubs.result_filter
        .withArgs(json, type)
        .returns(json);

      return new Promise((resolve, reject) => {
        request(token).paginate(url, type)
          .then(data => {
            expect(stubs.result_filter).to.be.called;
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
    it('should handle requests with pagination', () => {
      const json = [
        { foo: 'bar' },
        { foo: 'foo' },
      ];
      const nextUrl = `${url}?page=2`;
      const headers = {
        link: `<${nextUrl}>; rel="next"`,
      };
      const expected = {
        json,
        headers,
      };
      options = {
        headers: {
          'User-Agent': 'request',
          Authorization: `token ${token}`,
        },
        url,
      };

      stubs.etag_handler.getEtag
        .withArgs(url + token)
        .yields(undefined);
      stubs.etag_handler.getEtag
        .withArgs(nextUrl + token)
        .yields(undefined);
      stubs.request
        .withArgs(options = {
          headers: {
            'User-Agent': 'request',
            Authorization: `token ${token}`,
          },
          url,
        })
        .yields(null, { headers }, JSON.stringify(json[0]));
      stubs.request
        .withArgs(options = {
          headers: {
            'User-Agent': 'request',
            Authorization: `token ${token}`,
          },
          url: nextUrl,
        })
        .yields(null, {}, JSON.stringify(json[1]));
      stubs.result_filter
        .withArgs(json[0], type)
        .returns(json[0]);
      stubs.result_filter
        .withArgs(json[1], type)
        .returns(json[1]);

      return new Promise((resolve, reject) => {
        request(token).paginate(url, type)
          .then(data => {
            expect(stubs.result_filter).to.be.called;
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
  });
});
