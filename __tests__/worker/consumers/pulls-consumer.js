import _ from 'lodash';

import {
  receivedPulls,
  receivedPullsIssues,
  receivedPullsReviews,
  receivedPullsStatuses,
} from '../../../client/actions';
import '../../../config';
import '../../../common/rabbit';
import {
  issues as fetchIssues,
  pulls as fetchPulls,
  repositories as fetchRepositories,
  reviews as fetchReviews,
  statuses as fetchStatuses,
} from '../../../common/github/fetcher';
import rateNotifier from '../../../common/github/rate-notifier';

import consumer from '../../../worker/consumers/pulls-consumer';

jest.mock('lodash', () => {
  const producer = jest.fn();
  const curry = () => () => producer;

  curry.producer = producer;

  return {
    curry,
    isEmpty: jest.fn(),
  };
});
jest.mock('../../../client/actions', () => ({
  receivedPulls: jest.fn(),
  receivedPullsIssues: jest.fn(),
  receivedPullsReviews: jest.fn(),
  receivedPullsStatuses: jest.fn(),
}));
jest.mock('../../../config', () => ({
  get: jest.fn((key) => {
    if (key === 'snowshoe.pulls.sort.key') {
      return 'sort_key';
    }

    return 'sort_direction';
  }),
}));
jest.mock('../../../common/rabbit', () => ({
  produce: jest.fn(),
}));
jest.mock('../../../common/github/fetcher', () => ({
  issues: jest.fn(),
  pulls: jest.fn(),
  repositories: jest.fn(),
  reviews: jest.fn(),
  statuses: jest.fn(),
}));
jest.mock('../../../common/github/rate-notifier', () => jest.fn());

describe('[Consumers - pulls]', () => {
  const token = 'test_token';
  const url = 'test_url';
  const sort = {
    key: 'sort_key',
    direction: 'sort_direction',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('repositories', () => {
    it('should fetch repositories', () => {
      fetchRepositories.mockImplementationOnce(() => Promise.resolve({
        json: [{ pulls_url: 'url' }],
      }));
      fetchPulls.mockImplementationOnce(() => Promise.resolve({ json: [] }));

      return consumer(token, url)
        .then(() => {
          expect(fetchRepositories)
            .toHaveBeenCalledWith(token, url);
        });
    });

    it('should return the rejected promise on error', () => {
      fetchRepositories.mockImplementationOnce(() => Promise.reject(Error('Unexpected Error')));

      return consumer(token, url)
        .then(() => Error('Should not have been called'))
        .catch(() => true);
    });
  });

  describe('pulls', () => {
    it('should produce pull_requests on rabbit if length > 0', () => {
      fetchRepositories.mockImplementationOnce(() => Promise.resolve({
        json: [{
          full_name: 'test_repository',
          pulls_url: 'repository_pulls_url',
        }],
      }));
      fetchPulls.mockImplementationOnce(() => Promise.resolve({
        json: [{ name: 'test_pull' }],
      }));
      fetchStatuses.mockImplementationOnce(() => Promise.resolve([]));
      fetchIssues.mockImplementationOnce(() => Promise.resolve({ json: [] }));
      fetchReviews.mockImplementationOnce(() => Promise.resolve([]));
      receivedPulls.mockImplementationOnce((json) => json);

      const data = {
        pulls: [{ name: 'test_pull' }],
        repo: 'test_repository',
        sort,
      };
      const json = JSON.stringify(data);

      return consumer(token, url)
        .then(() => {
          expect(_.curry.producer)
            .toHaveBeenCalledWith(json);
          expect(fetchPulls)
            .toHaveBeenCalledWith(token, 'repository_pulls_url');
          expect(receivedPulls)
            .toHaveBeenCalledWith(data, token);
        });
    });
  });

  describe('statuses', () => {
    it('should send the valid statuses to the producer', () => {
      fetchRepositories.mockImplementationOnce(() => Promise.resolve({
        json: [{
          full_name: 'test_repository',
          pulls_url: 'repository_pulls_url',
        }],
      }));
      fetchPulls.mockImplementationOnce(() => Promise.resolve({
        json: [{ name: 'test_pull' }],
      }));
      fetchStatuses.mockImplementationOnce(() => Promise.resolve([{
        json: {
          label: 'label_1',
        },
        headers: {
          'x-ratelimit-remaining': 4900,
        },
      }, {
        json: {
          label: 'label_2',
        },
        headers: {
          'x-ratelimit-remaining': 4800,
        },
      }]));
      fetchReviews.mockImplementationOnce(() => Promise.resolve([{}]));
      fetchIssues.mockImplementationOnce(() => Promise.resolve({ json: [] }));
      receivedPulls.mockImplementationOnce((json) => json);
      receivedPullsStatuses.mockImplementationOnce((json) => json);

      const json = JSON.stringify({
        pulls: [{ name: 'test_pull' }],
        repo: 'test_repository',
        sort,
      });

      return consumer(token, url)
        .then((data) => {
          expect(_.curry.producer.mock.calls[0])
            .toEqual([json]);
          expect(_.curry.producer.mock.calls[1])
            .toEqual([JSON.stringify([{
              label: 'label_1',
            }, {
              label: 'label_2',
            }])]);

          expect(receivedPullsStatuses)
            .toHaveBeenCalledWith([{
              label: 'label_1',
            }, {
              label: 'label_2',
            }], token);

          expect(data)
            .toEqual([
              {
                headers: {
                  'x-ratelimit-remaining': 4800,
                },
                json: {
                  label: 'label_2',
                },
              }, {
                json: [],
              },
              {},
            ]);
        });
    });

    it('should not call producer when no statuses', () => {
      fetchRepositories.mockImplementationOnce(() => Promise.resolve({
        json: [{
          full_name: 'test_repository',
          pulls_url: 'repository_pulls_url',
        }],
      }));
      fetchPulls.mockImplementationOnce(() => Promise.resolve({
        json: [{ name: 'test_pull' }],
      }));
      fetchStatuses.mockImplementationOnce(() => Promise.resolve([{
      }]));
      fetchReviews.mockImplementationOnce(() => Promise.resolve([{}]));
      fetchIssues.mockImplementationOnce(() => Promise.resolve({ json: [] }));
      receivedPulls.mockImplementationOnce((json) => json);
      receivedPullsStatuses.mockImplementationOnce((json) => json);

      const json = JSON.stringify({
        pulls: [{ name: 'test_pull' }],
        repo: 'test_repository',
        sort,
      });

      return consumer(token, url)
        .then((data) => {
          expect(_.curry.producer.mock.calls[0])
            .toEqual([json]);
          expect(_.curry.producer.mock.calls[1])
            .toEqual(undefined);

          expect(receivedPullsStatuses)
            .not
            .toHaveBeenCalled();

          expect(data)
            .toEqual([
              {},
              {
                json: [],
              },
              {},
            ]);
        });
    });
  });

  describe('issues', () => {
    it('should send the non-empty issues to the producer, ', () => {
      fetchRepositories.mockImplementationOnce(() => Promise.resolve({
        json: [{
          full_name: 'test_repository',
          pulls_url: 'repository_pulls_url',
        }],
      }));
      fetchPulls.mockImplementationOnce(() => Promise.resolve({
        json: [{ name: 'test_pull' }],
      }));
      fetchStatuses.mockImplementationOnce(() => Promise.resolve([{
      }]));
      fetchReviews.mockImplementationOnce(() => Promise.resolve([{}]));
      fetchIssues.mockImplementationOnce(() => Promise.resolve({
        headers: {
          'x-ratelimit-remaining': 4500,
        },
        json: [{ label: 'issue_1' }],
      }));
      receivedPulls.mockImplementationOnce((json) => json);
      receivedPullsIssues.mockImplementationOnce((json) => json);
      receivedPullsStatuses.mockImplementationOnce((json) => json);

      const data = {
        pulls: [{ name: 'test_pull' }],
        repo: 'test_repository',
        sort,
      };
      const json = JSON.stringify(data);

      return consumer(token, url)
        .then((rate) => {
          expect(_.curry.producer.mock.calls[0])
            .toEqual([json]);
          expect(_.curry.producer.mock.calls[1])
            .toEqual([JSON.stringify([{ label: 'issue_1' }])]);

          expect(rate)
            .toEqual([{}, {
              headers: {
                'x-ratelimit-remaining': 4500
              },
              json: [{ label: 'issue_1' }],
            }, {}]);
        });
    });
  });

  describe('rate', () => {
    it('should send the rate to the notifier', () => {
      fetchRepositories.mockImplementationOnce(() => Promise.resolve({
        json: [{
          full_name: 'test_repository',
          pulls_url: 'repository_pulls_url',
        }],
      }));
      fetchPulls.mockImplementationOnce(() => Promise.resolve({
        json: [{ name: 'test_pull' }],
      }));
      fetchStatuses.mockImplementationOnce(() => Promise.resolve([{
        headers: {
          'x-ratelimit-remaining': 4900,
        },
        json: {},
      }, {
        headers: {
          'x-ratelimit-remaining': 4800,
        },
        json: {},
      }]));
      fetchReviews.mockImplementationOnce(() => Promise.resolve([{
        headers: {
          'x-ratelimit-remaining': 4600,
        },
        json: {},
      }]));
      fetchIssues.mockImplementationOnce(() => Promise.resolve({
        headers: {
          'x-ratelimit-remaining': 4500,
        }
      }));
      receivedPulls.mockImplementationOnce((json) => json);

      return consumer(token, url)
        .then((rate) => {
          expect(rateNotifier)
            .toHaveBeenCalledWith(
              token,
            {
              headers: {
                'x-ratelimit-remaining': 4500,
              },
            }
            );
          expect(rate)
            .toEqual([{
              headers: {
                'x-ratelimit-remaining': 4800,
              },
              json: {},
            }, {
              headers: {
                'x-ratelimit-remaining': 4500,
              },
            }, {
              headers: {
                'x-ratelimit-remaining': 4600,
              },
              json: {},
            }]);
        });
    });

    it('should notify default remaining when no headers found', () => {
      fetchRepositories.mockImplementationOnce(() => Promise.resolve({
        json: [{
          full_name: 'test_repository',
          pulls_url: 'repository_pulls_url',
        }],
      }));
      fetchPulls.mockImplementationOnce(() => Promise.resolve({
        json: [{ name: 'test_pull' }],
      }));
      fetchStatuses.mockImplementationOnce(() => Promise.resolve([{
      }]));
      fetchIssues.mockImplementationOnce(() => Promise.resolve({
      }));
      fetchReviews.mockImplementationOnce(() => Promise.resolve([{}]));
      receivedPulls.mockImplementationOnce((json) => json);

      return consumer(token, url)
        .then(() => {
          expect(rateNotifier)
            .toHaveBeenCalledWith(
              token,
            {
              headers: {
                'x-ratelimit-remaining': 5000,
              },
            }
            );
        });
    });
  });
});
