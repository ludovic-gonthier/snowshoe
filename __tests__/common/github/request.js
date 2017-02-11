import request from 'request';

import etagHandler from '../../../common/github/etag-handler';
import filter from '../../../common/github/result-filter';

import requester from '../../../common/github/request';

jest.mock('request', () => jest.fn());
jest.mock('../../../common/github/etag-handler', () => ({
  getEtag: jest.fn(),
  store: jest.fn(),
}));
jest.mock('../../../common/github/result-filter', () => jest.fn());

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
    jest.resetAllMocks();
  });

  describe('.call()', () => {
    it('should return a promise', () => {
      expect(requester(token).call(url, type))
        .toBeInstanceOf(Promise);
    });

    describe('should reject the promise', () => {
      beforeEach(() => {
        etagHandler.getEtag
          .mockImplementationOnce((_, callback) => callback({ etag }));
      });

      test('when the request fails', () => {
        request
          .mockImplementationOnce((_, callback) => {
            callback(new Error('Request fails'));
          });

        return new Promise((resolve, reject) => {
          requester(token).call(url, type)
            .then(() => reject(new Error('Should have failed')))
            .catch(() => {
              expect(etagHandler.getEtag)
                .toBeCalledWith(url + token, expect.any(Function));
              expect(request)
                .toBeCalledWith(options, expect.any(Function));
              resolve();
            });
        });
      });

      test('when the status code is 200 < status && status >= 400', () => {
        const response = { statusCode: 403 };
        const body = JSON.stringify('{message: "Authorization fails"');

        request
          .mockImplementationOnce((_, callback) => callback(null, response, body));

        return new Promise((resolve, reject) => {
          requester(token).call(url, type)
            .then(() => reject(new Error('Should have failed')))
            .catch(() => {
              expect(etagHandler.getEtag)
                .toBeCalledWith(url + token, expect.any(Function));
              expect(request)
                .toBeCalledWith(options, expect.any(Function));

              resolve();
            });
        });
      });

      test('when the response body cannot be parsed to JSON', () => {
        const response = { statusCode: 200 };

        request
          .mockImplementationOnce((_, callback) => callback(null, response));

        return new Promise((resolve, reject) => {
          requester(token).call(url, type)
            .then(() => reject(new Error('Should have failed')))
            .catch(() => {
              expect(etagHandler.getEtag)
                .toBeCalledWith(url + token, expect.any(Function));
              expect(request)
                .toBeCalledWith(options, expect.any(Function));
              resolve();
            });
        });
      });
    });

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
      etagHandler.getEtag
        .mockImplementationOnce((_, callback) => callback());
      request
        .mockImplementationOnce((_, callback) => {
          callback(null, { headers }, JSON.stringify(json));
        });
      filter
        .mockImplementationOnce(() => json);

      return requester(token).call(url, type)
        .then((data) => {
          expect(data)
            .toEqual(expected);

          expect(filter)
            .toHaveBeenCalledWith(json, type);
          expect(request)
            .toBeCalledWith(options, expect.any(Function));
          expect(etagHandler.getEtag)
            .toBeCalledWith(url + token, expect.any(Function));
        });
    });

    it('should stores the response ETag', () => {
      const json = { foo: 'bar' };
      const headers = {};

      etagHandler.getEtag
        .mockImplementationOnce((_, callback) => callback());
      request
        .mockImplementationOnce((_, callback) => {
          callback(null, { headers }, JSON.stringify(json));
        });
      filter
        .mockImplementationOnce(() => json);

      return requester(token).call(url, type)
        .then(() => {
          expect(etagHandler.store)
            .toHaveBeenCalledWith(url + token, json, headers);
          expect(etagHandler.getEtag)
            .toHaveBeenCalledWith(url + token, expect.any(Function));
          expect(filter)
            .toHaveBeenCalledWith(json, type);
          expect(request)
            .toBeCalled();
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

      etagHandler.getEtag
        .mockImplementationOnce((_, callback) => callback({ etag }));
      request
        .mockImplementationOnce((_, callback) => {
          callback(null, { headers: {} }, JSON.stringify({}));
        });

      return requester(token).call(url, type)
        .then(() => {
          expect(request)
            .toHaveBeenCalled();
          expect(etagHandler.getEtag)
            .toBeCalledWith(url + token, expect.any(Function));
          expect(request)
            .toBeCalledWith(options, expect.any(Function));
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

      etagHandler.getEtag
        .mockImplementationOnce((_, callback) => callback(stored));
      request
        .mockImplementationOnce((_, callback) => {
          callback(null, response, JSON.stringify({}));
        });

      return requester(token).call(url, type)
        .then((data) => {
          expect(data)
            .toEqual(expected);
          expect(etagHandler.getEtag)
            .toBeCalledWith(url + token, expect.any(Function));
          expect(request)
            .toBeCalledWith(options, expect.any(Function));
        });
    });
  });

  describe('.paginate()', () => {
    it('should return a promise', () => {
      expect(requester(token).call(url, type))
        .toBeInstanceOf(Promise);
    });

    it('should reject the promise when a call fails', () => {
      etagHandler.getEtag
        .mockImplementationOnce((_, callback) => callback({ etag }));
      request
        .mockImplementationOnce((_, callback) => {
          callback(new Error('Request fails'));
        });

      return new Promise((resolve, reject) => {
        requester(token).paginate(url, type)
          .then(() => reject('Should have failed'))
          .catch(() => {
            expect(etagHandler.getEtag)
              .toBeCalledWith(url + token, expect.any(Function));
            expect(request)
              .toBeCalledWith(options, expect.any(Function));

            resolve();
          });
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

      etagHandler.getEtag
        .mockImplementationOnce((_, callback) => callback());
      request
        .mockImplementationOnce((_, callback) => {
          callback(null, { headers }, JSON.stringify(json));
        });
      filter.mockImplementationOnce(() => json);

      return requester(token).paginate(url, type)
        .then((data) => {
          expect(data)
            .toEqual(expected);
          expect(etagHandler.getEtag)
            .toBeCalledWith(url + token, expect.any(Function));
          expect(request)
            .toBeCalledWith(options, expect.any(Function));
          expect(filter)
            .toHaveBeenCalledWith(json, type);
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

      etagHandler.getEtag
        .mockImplementation((_, callback) => callback());
      etagHandler.getEtag
        .mockImplementation((_, callback) => callback());
      request
        .mockImplementationOnce((_, callback) => {
          callback(null, { headers }, JSON.stringify(json[0]));
        });
      request
        .mockImplementationOnce((_, callback) => {
          callback(null, { headers }, JSON.stringify(json[1]));
        });
      filter
        .mockImplementation((object) => object);

      return requester(token).paginate(url, type)
        .then((data) => {
          expect(data)
            .toEqual(expected);

          expect(etagHandler.getEtag.mock.calls[0])
            .toEqual([url + token, expect.any(Function)]);
          expect(etagHandler.getEtag.mock.calls[1])
            .toEqual([nextUrl + token, expect.any(Function)]);

          expect(request).toHaveBeenCalledTimes(2);
          expect(request.mock.calls[0])
            .toEqual([{
              headers: {
                'User-Agent': 'request',
                Authorization: `token ${token}`,
              },
              url,
            }, expect.any(Function)]);
          expect(request.mock.calls[1])
            .toEqual([{
              headers: {
                'User-Agent': 'request',
                Authorization: `token ${token}`,
              },
              url: nextUrl,
            }, expect.any(Function)]);

          expect(filter)
            .toHaveBeenCalledTimes(2);
        });
    });
  });
});

