import '../../../config';
import formatter from '../../../common/github/url-formatter';
import request from '../../../common/github/request';

import fixtures from './fixtures/fetcher.json';

import {
  organizations,
  teams,
  repositories,
  pulls,
  issues,
  statuses,
} from '../../../common/github/fetcher';

jest.mock('../../../common/github/url-formatter', () => jest.fn());
jest.mock('../../../common/github/request', () => jest.fn());
jest.mock('../../../config', () => ({
  get: jest.fn((key) => {
    switch (key) {
      case 'snowshoe.display_pr_title':
        return true;
      default: return '';
    }
  }),
}));

const stubs = {
  call: jest.fn(),
  paginate: jest.fn(),
};

describe('fetcher', () => {
  beforeEach(() => {
    formatter.mockReset();
    stubs.call.mockReset();
    stubs.paginate.mockReset();

    request.mockImplementation(() => stubs);
  });

  describe('.organizations()', () => {
    it('should returns a list of organization', () => {
      const object = { json: { test: 'succeed' } };

      formatter
        .mockImplementationOnce(() => 'https://api.github.com/user/orgs?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.resolve(object));

      return organizations('test_token')
        .then((data) => {
          expect(data)
            .toEqual({ json: { test: 'succeed' } });
          expect(formatter)
            .toBeCalledWith('/user/orgs', { per_page: 100 });
          expect(stubs.paginate)
            .toBeCalledWith('https://api.github.com/user/orgs?per_page=100', 'organization');
        });
    });

    it('should reject the promise on error', () => {
      formatter
        .mockImplementationOnce(() => 'https://api.github.com/user/orgs?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.reject(new Error('Pagination error')));

      return new Promise((resolve, reject) => {
        organizations('test_token')
        .then(() => reject(Error('Promise should have been rejected')))
        .catch(resolve);
      });
    });
  });

  describe('.teams()', () => {
    it('should returns a list of team', () => {
      const object = { json: { test: 'succeed' } };

      formatter
        .mockImplementationOnce(() => 'https://api.github.com/orgs/snowshoe/teams?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.resolve(object));

      return teams('test_token', 'snowshoe')
        .then((data) => {
          expect(data)
            .toEqual({ json: { test: 'succeed' } });

          expect(formatter)
            .toBeCalledWith('orgs/snowshoe/teams', { per_page: 100 });
          expect(stubs.paginate)
            .toBeCalledWith('https://api.github.com/orgs/snowshoe/teams?per_page=100', 'team');
        });
    });

    it('should reject the promise on error', () => {
      formatter
        .mockImplementationOnce(() => 'https://api.github.com/orgs/snowshoe/teams?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.reject(new Error('Pagination error')));

      return new Promise((resolve, reject) => {
        teams('test_token', 'snowshoe')
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });

  describe('.repositories()', () => {
    it('should returns a list of team', () => {
      const object = { json: { test: 'succeed' } };

      formatter
        .mockImplementationOnce(() => 'https://api.github.com/user/repos?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.resolve(object));

      return repositories('test_token', 'user/repos')
        .then((data) => {
          expect(data)
            .toEqual({ json: { test: 'succeed' } });

          expect(formatter)
            .toBeCalledWith('user/repos', { per_page: 100 });
          expect(stubs.paginate)
            .toBeCalledWith('https://api.github.com/user/repos?per_page=100', 'repository');
        });
    });
    it('should reject the promise on error', () => {
      formatter
        .mockImplementationOnce(() => 'https://api.github.com/user/repos?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.reject(new Error('Pagination error')));

      return new Promise((resolve, reject) => {
        repositories('test_token', 'user/repos')
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });

  describe('.pulls()', () => {
    it('should returns a list of pull request', () => {
      const object = fixtures.pulls_simple;
      const repository = {
        pulls_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
      };

      formatter
        .mockImplementationOnce(() => 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.resolve(object));

      return pulls('test_token', repository.pulls_url)
        .then((data) => {
          expect(data)
            .toEqual(object);

          expect(formatter)
            .toBeCalledWith(
              'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
              { per_page: 100 }
            );
          expect(stubs.paginate)
            .toBeCalledWith('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100', 'pull');
        });
    });

    it('should not returns locked pull requests', () => {
      const object = fixtures.pulls_with_locked;
      const expected = {
        json: [{
          base: {
            repo: {
              name: 'goul-registry',
            },
          },
          id: 36567207,
          isTitleDisplayed: true,
          locked: false,
          number: 3,
          title: 'refactor: remove dead code',
          url: 'https://api.github.com/repos/ludovic-gonthier/goul-registry/pulls/3',
          user: {
            login: 'ludovic-gonthier',
            avatar_url: 'https://avatars.githubusercontent.com/u/2995136?v=3',
          },
          html_url: 'https://github.com/ludovic-gonthier/goul-registry/pull/3',
        }],
        headers: {},
      };
      const repository = {
        pulls_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
      };

      formatter
        .mockImplementationOnce(() => 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.resolve(object));

      pulls('test_token', repository.pulls_url)
        .then((data) => {
          expect(data)
            .toEqual(expected);

          expect(formatter)
            .toBeCalledWith(
              'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
              { per_page: 100 }
            );
          expect(stubs.paginate)
            .toBeCalledWith('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100', 'pull');
        });
    });
    it('should reject the promise on error', () => {
      const repository = {
        pulls_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
      };

      formatter
        .mockImplementationOnce(() => 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100');
      stubs.paginate
        .mockImplementationOnce(() => Promise.reject(new Error('Pagination error')));

      return new Promise((resolve, reject) => {
        pulls('test_token', repository.pulls_url)
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });

  describe('.issues()', () => {
    it('should returns the issue linked to the repository', () => {
      const repository = {
        issues_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues{/number}',
      };

      formatter
        .mockImplementationOnce(() => 'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100');

      stubs.paginate
        .mockImplementationOnce(() => Promise.resolve(fixtures.issues));

      return issues('test_token', repository.issues_url)
        .then((data) => {
          const filtered = fixtures.issues.json.filter((issue) => 'pull_request' in issue);

          expect(data)
            .toEqual({ json: filtered, headers: {} });

          expect(formatter)
            .toBeCalledWith(
              'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues{/number}',
              { per_page: 100 }
            );
          expect(stubs.paginate)
            .toBeCalledWith('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100', 'issue');
        });
    });

    it('should reject the promise on error', () => {
      const repository = {
        issues_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues{/number}',
      };

      formatter
        .mockImplementationOnce(() => 'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100');

      stubs.paginate
        .mockImplementationOnce(() => Promise.reject(new Error('Pagination error')));

      return new Promise((resolve, reject) => {
        issues('test_token', repository.issues_url)
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });

  describe('.statuses()', () => {
    it('should returns the list of the last pulls statuses', () => {
      const fpulls = [{
        id: 1,
        base: { repo: { url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe' } },
        head: { sha: '67sd687ad4adsd6' },
        stub: fixtures.status_1,
      }, {
        id: 2,
        base: { repo: { url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe' } },
        head: { sha: '09u1423knwe0' },
        stub: fixtures.status_2,
      }, {
        id: 3,
        base: { repo: { url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe' } },
        head: { sha: '09123231m813209n' },
        stub: fixtures.status_3,
      }];

      fpulls.forEach((item) => {
        stubs.call
          .mockImplementationOnce(() => Promise.resolve(item.stub));
      });

      return statuses('test_token', fpulls)
        .then((data) => {
          expect(data).toEqual([
            {
              json: {
                statuses: [{ state: 'success' }],
                pull_request: { id: 1 },
              },
              headers: {},
            }, {
              json: {
                statuses: [{ state: 'success' }],
                pull_request: { id: 2 },
              },
              headers: {},
            },
            null,
          ]);

          fpulls.forEach((item, index) => {
            expect(stubs.call.mock.calls[index])
              .toEqual([`https://api.github.com/repos/ludovic-gonthier/snowshoe/commits/${item.head.sha}/status`, 'status']);
          });
        });
    });
    it('should reject the promise on error', () => {
      const fpulls = [{
        base: { repo: { url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe' } },
        head: { sha: '67sd687ad4adsd6' },
      }];
      stubs.call
        .mockImplementationOnce(() => Promise.reject(new Error('Pagination error')));

      return new Promise((resolve, reject) => {
        statuses('test_token', fpulls)
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });
});

