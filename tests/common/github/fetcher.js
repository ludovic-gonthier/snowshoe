/* global beforeEach, describe, expect, it, proxyquire, ROOT_PATH, sinon */
/* eslint-disable no-unused-expressions */
import sinon from 'sinon';

import fixtures from '../../fixtures/common/github/fetcher.json';

const stubs = {
  rate_notifier: sinon.stub(),
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
  './rate-notifier': { notifier: stubs.rate_notifier },
  './request': { default: requestStub },
  './url-formatter': { default: stubs.url_formatter },
});

describe('fetcher', () => {
  beforeEach(() => {
    stubs.socket.emit.reset();
    stubs.url_formatter.reset();
    stubs.rate_notifier.reset();
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
      stubs.rate_notifier
        .withArgs('test_token', object)
        .returns(object);

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        organizations('test_token')
          .then((data) => {
            expect(stubs.rate_notifier).to.have.been.called;
            expect(data).to.eql({ test: 'succeed' });
            resolve();
          })
          .catch(reject);
      });
    });
    it('should resolve the promise with empty array on error', () => {
      stubs.url_formatter
        .withArgs('/user/orgs', { per_page: 100 })
        .returns('https://api.github.com/user/orgs?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/user/orgs?per_page=100', 'organization')
        .returns(Promise.reject(new Error('Pagination error')));
      console.error = sinon.stub(); // eslint-disable-line no-console

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        organizations('test_token')
          .then(data => {
            expect(console.error).to.have.been.called; // eslint-disable-line no-console
            expect(data).to.eql([]);
            resolve();
          })
          .catch(reject);
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
      stubs.rate_notifier
        .withArgs('test_token', object)
        .returns(object);

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        teams('test_token', 'snowshoe')
          .then(data => {
            expect(stubs.rate_notifier).to.have.been.called;
            expect(data).to.eql({ test: 'succeed' });
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
      console.error = sinon.stub();

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        teams('test_token', 'snowshoe')
          .then(data => {
            expect(console.error).to.have.been.called; // eslint-disable-line no-console
            expect(data).to.eql([]);
            resolve();
          })
          .catch(reject);
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
      stubs.rate_notifier
        .withArgs('test_token', object)
        .returns(object);

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        repositories('test_token', 'user/repos')
          .then(data => {
            expect(stubs.rate_notifier).to.have.been.called;
            expect(data).to.eql({ test: 'succeed' });
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
          { per_page: 100 }
        )
        .returns(
        'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100'
      );
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100', 'pull')
        .returns(Promise.resolve(object));
      stubs.rate_notifier
        .withArgs('test_token', object)
        .returns(object);

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        pulls('test_token', repository.pulls_url)
          .then(data => {
            expect(data).to.eql(object.json);
            expect(stubs.rate_notifier).to.have.been.called;

            resolve();
          })
          .catch(reject);
      });
    });
    it('should not returns locked pull requests', () => {
      const object = fixtures.pulls_with_locked;
      const expected = [
        {
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
        },
      ];
      const repository = {
        pulls_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
      };

      stubs.url_formatter
        .withArgs(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}',
          { per_page: 100 }
        )
        .returns(
        'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100'
      );
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100', 'pull')
        .returns(Promise.resolve(object));
      stubs.rate_notifier
        .withArgs('test_token', object)
        .returns(object);

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        pulls('test_token', repository.pulls_url)
          .then(data => {
            expect(data).to.eql(expected);
            expect(stubs.rate_notifier).to.have.been.called;

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
          { per_page: 100 }
        )
        .returns(
        'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100'
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
          { per_page: 100 }
        )
        .returns(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100'
        );
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100', 'issue')
        .returns(Promise.resolve(fixtures.issues));
      stubs.rate_notifier
        .withArgs('test_token', fixtures.issues)
        .returns(fixtures.issues);

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        issues('test_token', repository.issues_url)
          .then((data) => {
            const filtered = fixtures.issues.json.filter(issue => 'pull_request' in issue);

            expect(data).to.eql(filtered);
            expect(stubs.rate_notifier).to.have.been.called;

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
          { per_page: 100 }
        )
        .returns(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100'
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
        statuses_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/0',
        stub: fixtures.status_1,
      }, {
        id: 2,
        statuses_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/1',
        stub: fixtures.status_2,
      }, {
        id: 3,
        statuses_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/2',
        stub: fixtures.status_3,
      }];

      fpulls.forEach((item, index) => {
        stubs.url_formatter
          .withArgs(
            `https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/${index}`,
            { per_page: 1 }
          )
          .returns(
            `https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/${index}?per_page=1`
          );
        stubs.request.call
          .withArgs(`https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/${index}?per_page=1`, 'status')
          .returns(Promise.resolve(item.stub));
        stubs.rate_notifier
          .withArgs('test_token', item.stub)
          .returns(item.stub);
      });

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);

      return new Promise((resolve, reject) => {
        statuses('test_token', fpulls)
          .then((data) => {
            expect(stubs.rate_notifier).to.be.calledThrice;
            expect(data).to.eql([{
              state: 'success_1',
              pull_request: { id: 1 },
            }, {
              state: 'success_2',
              pull_request: { id: 2 },
            }]);

            resolve();
          })
          .catch(error => {reject(error.stack.split(`\n`)); });
      });
    });
    it('should reject the promise on error', () => {
      const fpulls = [{
        statuses_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/',
      }];
      stubs.url_formatter
        .withArgs(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/',
          { per_page: 1 }
        )
        .returns(
          'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/?per_page=1'
        );
      stubs.request.call
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/?per_page=1', 'status')
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
