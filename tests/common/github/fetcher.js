/* global beforeEach, describe, expect, it, proxyquire, ROOT_PATH, sinon */
/* eslint-disable no-unused-expressions */
import sinon from 'sinon';

import fixtures from '../../fixtures/common/github/fetcher.json';

const stubs = {
  request: {
    paginate: sinon.stub(),
    call: sinon.stub(),
  },
  socket: {
    emit: sinon.stub(),
  },
  url_formatter: sinon.stub(),
};

const requestStub = sinon.stub();

const {
  organizations,
  teams,
  repositories,
  pulls,
  issues,
  statuses,
} = proxyquire(`${ROOT_PATH}/common/github/fetcher`, {
  './request': { default: requestStub },
  './url-formatter': { default: stubs.url_formatter },
});

describe('fetcher', () => {
  beforeEach(() => {
    stubs.socket.emit.reset();
    stubs.url_formatter.reset();
    stubs.request.paginate.reset();
    stubs.request.call.reset();
  });

  describe('.organizations()', () => {
    it('should returns a list of organization', () => {
      const object = { json: { test: 'succeed' } };

      stubs.url_formatter
        .withArgs('/user/orgs', { per_page: 100 })
        .returns('https://api.github.com/user/orgs?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/user/orgs?per_page=100', 'organization')
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        organizations('test_token')
          .then((data) => {
            expect(data).to.eql({ json: { test: 'succeed' } });
            resolve();
          })
          .catch(reject);
      });
    });
    it('should reject the promise on error', () => {
      stubs.url_formatter
        .withArgs('/user/orgs', { per_page: 100 })
        .returns('https://api.github.com/user/orgs?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/user/orgs?per_page=100', 'organization')
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        organizations('test_token')
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });

  describe('.teams()', () => {
    it('should returns a list of team', () => {
      const object = { json: { test: 'succeed' } };

      stubs.url_formatter
        .withArgs('orgs/snowshoe/teams', { per_page: 100 })
        .returns('https://api.github.com/orgs/snowshoe/teams?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/orgs/snowshoe/teams?per_page=100', 'team')
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        teams('test_token', 'snowshoe')
          .then((data) => {
            expect(data).to.eql({ json: { test: 'succeed' } });
            resolve();
          })
          .catch(reject);
      });
    });
    it('should reject the promise on error', () => {
      stubs.url_formatter
        .withArgs('orgs/snowshoe/teams', { per_page: 100 })
        .returns('https://api.github.com/orgs/snowshoe/teams?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/orgs/snowshoe/teams?per_page=100', 'team')
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

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

      stubs.url_formatter
        .withArgs('user/repos', { per_page: 100 })
        .returns('https://api.github.com/user/repos?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/user/repos?per_page=100', 'repository')
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        repositories('test_token', 'user/repos')
          .then((data) => {
            expect(data).to.eql({ json: { test: 'succeed' } });
            resolve();
          })
          .catch(reject);
      });
    });
    it('should reject the promise on error', () => {
      stubs.url_formatter
        .withArgs('user/repos', { per_page: 100 })
        .returns('https://api.github.com/user/repos?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/user/repos?per_page=100', 'repository')
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

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

      stubs.url_formatter
        .withArgs(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
          { per_page: 100 },
        )
        .returns(
        'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100',
      );
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100', 'pull')
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        pulls('test_token', repository.pulls_url)
          .then((data) => {
            expect(data).to.eql(object);

            resolve();
          })
          .catch(reject);
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

      stubs.url_formatter
        .withArgs(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
          { per_page: 100 },
        )
        .returns(
        'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100',
      );
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100', 'pull')
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        pulls('test_token', repository.pulls_url)
          .then((data) => {
            expect(data).to.eql(expected);

            resolve();
          })
          .catch(reject);
      });
    });
    it('should reject the promise on error', () => {
      const repository = {
        pulls_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
      };

      stubs.url_formatter
        .withArgs(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
          { per_page: 100 },
        )
        .returns(
        'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100',
      );
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100', 'pull')
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

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

      stubs.url_formatter
        .withArgs(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues{/number}',
          { per_page: 100 },
        )
        .returns(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100',
        );
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100', 'issue')
        .returns(Promise.resolve(fixtures.issues));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        issues('test_token', repository.issues_url)
          .then((data) => {
            const filtered = fixtures.issues.json.filter(issue => 'pull_request' in issue);

            expect(data).to.eql({ json: filtered, headers: {} });

            resolve();
          })
          .catch(reject);
      });
    });

    it('should reject the promise on error', () => {
      const repository = {
        issues_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues{/number}',
      };

      stubs.url_formatter
        .withArgs(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues',
          { per_page: 100 },
        )
        .returns(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100',
        );
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100', 'issue')
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

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
        stubs.request.call.withArgs(
            `https://api.github.com/repos/ludovic-gonthier/snowshoe/commits/${item.head.sha}/status`,
            'status',
          ).returns(Promise.resolve(item.stub));
      });

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        statuses('test_token', fpulls)
          .then((data) => {
            expect(data).to.eql([
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

            resolve();
          })
          .catch((error) => { reject(error.stack.split('\n')); });
      });
    });
    it('should reject the promise on error', () => {
      const fpulls = [{
        base: { repo: { url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe' } },
        head: { sha: '67sd687ad4adsd6' },
      }];
      stubs.request.call
        .withArgs(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/commits/67sd687ad4adsd6/status',
          'status',
        )
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        statuses('test_token', fpulls)
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });
});
