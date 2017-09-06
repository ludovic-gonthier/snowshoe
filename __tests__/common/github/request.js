import request from 'request-promise-native';

import etagHandler from '../../../common/github/etag-handler';
import filter from '../../../common/github/result-filter';

import { call, paginate } from '../../../common/github/request';

jest.mock('request-promise-native', () => ({
  get: jest.fn(),
}));
jest.mock('../../../common/github/etag-handler', () => ({
  retrieve: jest.fn(),
  store: jest.fn(),
}));
jest.mock('../../../common/github/result-filter', () => jest.fn());

const TOKEN = 'test_token';
const TYPE = 'foo';
const URL = '/foo';

describe.only('request', () => {
  const headers = (token, etag) => ({
    headers: {
      'If-None-Match': `${etag}`,
      'User-Agent': 'application-snowshoe',
      Accept: 'application/vnd.github.black-cat-preview+json',
      Authorization: `token ${token}`,
    },
    json: true,
    resolveWithFullResponse: true,
  });

  beforeEach(jest.resetAllMocks);

  describe('.call()', () => {
    it('should try to retrieve a cached data', () => {
      etagHandler.retrieve.mockImplementationOnce(() => Promise.reject({}));

      expect.assertions(1);

      return call(URL, TYPE, TOKEN)
        .catch(() => {
          expect(etagHandler.retrieve)
            .toHaveBeenCalledWith(`${URL}::${TOKEN}`);
        });
    });

    it('should make the request with the good header', () => {
      etagHandler.retrieve
        .mockImplementationOnce(() => Promise.resolve({}));
      request.get
        .mockImplementationOnce(() => Promise.reject({}));

      expect.assertions(1);

      return call(URL, TYPE, TOKEN)
        .catch(() => {
          expect(request.get)
            .toHaveBeenCalledWith(URL, headers(TOKEN, ''));
        });
    });

    describe('when request fails', () => {
      it('should return the request error', () => {
        etagHandler.retrieve
          .mockImplementationOnce(() => Promise.resolve({}));
        request.get
          .mockImplementationOnce(() => Promise.reject(new Error('Request error')));

        expect.assertions(2);

        return call(URL, TYPE, TOKEN)
          .catch((error) => {
            expect(error)
              .toBeInstanceOf(Error);
            expect(error.message)
              .toBe('Request error');
          });
      });
    });

    describe('when status code in error range', () => {
      it('should return an error', () => {
        etagHandler.retrieve
          .mockImplementationOnce(() => Promise.resolve({}));
        request.get
          .mockImplementationOnce(() => Promise.resolve({
            statusCode: 500,
            statusMessage: '',
            body: {},
          }));

        expect.assertions(2);

        return call(URL, TYPE, TOKEN)
          .catch((error) => {
            expect(error)
              .toBeInstanceOf(Error);
            expect(error.message)
              .toContain('Github API Error:');
          });
      });
    });

    describe('when request succeed', () => {
      describe('with 304 code', () => {
        describe('with no cache found', () => {
          it('should return an error', () => {
            etagHandler.retrieve
              .mockImplementationOnce(() => Promise.resolve({}));
            request.get
              .mockImplementationOnce(() => Promise.resolve({
                statusCode: 304,
                statusMessage: '',
                body: {},
              }));

            expect.assertions(2);

            return call(URL, TYPE, TOKEN)
              .catch((error) => {
                expect(error)
                  .toBeInstanceOf(Error);
                expect(error.message)
                  .toContain('Not-Modified header');
              });
          });
        });

        describe('with cache found', () => {
          it('should return the cached data', () => {
            etagHandler.retrieve
              .mockImplementationOnce(() => Promise.resolve({
                json: 'the-cached-data',
              }));
            request.get
              .mockImplementationOnce(() => Promise.resolve({
                statusCode: 304,
                statusMessage: '',
                body: {},
              }));

            return call(URL, TYPE, TOKEN)
              .then((data) => {
                expect(data)
                  .toEqual({
                    headers: {},
                    json: 'the-cached-data',
                  });
              });
          });
        });
      });

      describe('with no etag header', () => {
        const response = {
          statusCode: 200,
          statusMessage: '',
          body: { foo: 'bar' },
        };
        const expected = {
          headers: {},
          json: response.body,
        };

        beforeEach(() => {
          etagHandler.retrieve
            .mockImplementationOnce(() => Promise.resolve({
              json: 'the-cached-data',
            }));
          request.get
            .mockImplementationOnce(() => Promise.resolve(response));
          filter.mockImplementationOnce((json) => json);
        });

        it('should not store in cache the response', () =>
          call(URL, TYPE, TOKEN)
            .then(() => {
              expect(etagHandler.store)
                .not
                .toHaveBeenCalled();
            })
        );

        it('should filter the data for the correct type', () =>
          call(URL, TYPE, TOKEN)
            .then(() => {
              expect(filter)
                .toHaveBeenCalledWith(response.body, TYPE);
            })
        );

        it('should return a resolved Promise', () =>
          call(URL, TYPE, TOKEN)
            .then((data) => {
              expect(data)
                .toEqual(expected);
            })
        );
      });

      describe('with an etag header', () => {
        const response = {
          body: { foo: 'bar' },
          headers: {
            etag: 'the-etag',
          },
          statusCode: 200,
          statusMessage: '',
        };
        const expected = {
          headers: {
            etag: 'the-etag',
          },
          json: response.body,
        };

        beforeEach(() => {
          etagHandler.retrieve
            .mockImplementationOnce(() => Promise.resolve({
              json: 'the-cached-data',
            }));
          request.get
            .mockImplementationOnce(() => Promise.resolve(response));
          filter.mockImplementationOnce((json) => json);
        });

        it('should try to store the response', () => {
          etagHandler.store
            .mockImplementationOnce(() => Promise.resolve({}));

          return call(URL, TYPE, TOKEN)
            .then(() => {
              expect(etagHandler.store)
                .toHaveBeenCalledWith(`${URL}::${TOKEN}`, expected.json, expected.headers);
            });
        });

        describe('on storage failure', () => {
          it('should return the storage error', () => {
            etagHandler.store
              .mockImplementationOnce(() => Promise.reject(new Error('Storage error')));

            expect.assertions(2);

            return call(URL, TYPE, TOKEN)
              .catch((error) => {
                expect(error)
                  .toBeInstanceOf(Error);
                expect(error.message)
                  .toContain('Storage error');
              });
          });
        });

        describe('on storage success', () => {
          it('should return the data', () => {
            etagHandler.store
              .mockImplementationOnce(() => Promise.resolve({}));

            return call(URL, TYPE, TOKEN)
              .then((data) => {
                expect(data)
                  .toEqual(expected);
              });
          });
        });
      });
    });
  });

  describe('.paginate()', () => {
    describe('when call fails', () => {
      it('should return a rejected Promise', () => {
        // Make .call() fail early
        etagHandler.retrieve
          .mockImplementationOnce(() => Promise.reject(new Error('Call Error')));

        expect.assertions(1);

        return paginate(URL, TYPE, TOKEN)
          .catch((error) => {
            expect(error.message)
              .toEqual('Call Error');
          });
      });
    });

    describe('when call succeed', () => {
      const baseResponse = {
        body: { foo: 'bar' },
        statusCode: 200,
      };

      beforeEach(() => {
        etagHandler.retrieve
          .mockImplementation(() => Promise.resolve({
            json: 'the-cached-data',
          }));
        filter.mockImplementation((json) => json);
      });

      describe('with no link header', () => {
        it('should return a resolved Promise with the aggregated data', () => {
          const response = Object.assign({}, baseResponse);
          const expected = {
            json: [response.body],
            headers: {},
          };

          request.get
            .mockImplementationOnce(() => Promise.resolve(response));

          return paginate(URL, TYPE, TOKEN)
            .then((data) => {
              expect(data)
                .toEqual(expected);
            });
        });
      });

      describe('with a link header with no next page', () => {
        it('should return a resolved Promise with the aggregated data', () => {
          const response = Object.assign(
            {},
            baseResponse,
            {
              headers: Object.assign(
                {},
                baseResponse.headers,
                {
                  link: `<${URL}?page=2>; rel="prev"`,
                }
              ),
            }
          );
          const expected = {
            json: [response.body],
            headers: response.headers,
          };

          request.get
            .mockImplementationOnce(() => Promise.resolve(response));

          return paginate(URL, TYPE, TOKEN)
            .then((data) => {
              expect(data)
                .toEqual(expected);
            });
        });
      });

      describe('with a link header with a next page', () => {
        it('should make the call to the next URL and return aggregated data', () => {
          const expected = {
            json: [{ foo: 'bar' }, { foo: 'foo' }],
            headers: Object.assign(
              {},
              baseResponse.headers,
              {
                link: `<${URL}?page=2>; rel="next"`,
              }
            ),
          };

          request.get
            .mockImplementationOnce(() => Promise.resolve(Object.assign(
              {},
              baseResponse,
              {
                body: { foo: 'bar' },
                headers: Object.assign(
                  {},
                  baseResponse.headers,
                  {
                    link: `<${URL}?page=2>; rel="next"`,
                  }
                ),
              }
            )));
          request.get
            .mockImplementationOnce(() => Promise.resolve(Object.assign(
              {},
              baseResponse,
              {
                body: { foo: 'foo' },
                headers: baseResponse.headers,
              }
            )));

          return paginate(URL, TYPE, TOKEN)
            .then((data) => {
              expect(data)
                .toEqual(expected);
            });
        });
      });
    });
  });
});

