/* global beforeEach, describe, expect, it, proxyquire, ROOT_PATH, sinon */
/* eslint-disable no-unused-expressions */
import Promise from 'promise';
import sinon from 'sinon';

import fixtures from '../../fixtures/server/github/fetcher.json';

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

const rateNotifierStub = sinon.stub();
const requestStub = sinon.stub();

const fetcher = proxyquire(`${ROOT_PATH}/server/github/fetcher`, {
  './rate-notifier': { default: rateNotifierStub },
  './request': { default: requestStub },
  './url-formatter': { default: stubs.url_formatter },
}).default;

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
        .withArgs(object)
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .organizations()
          .then((data) => {
            expect(stubs.socket.emit).to.have.been.calledOnce;
            expect(stubs.socket.emit)
              .to.have.been.calledWith('organizations', { test: 'succeed' });


            expect(data).to.eql({ test: 'succeed' });
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
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .organizations()
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
      stubs.rate_notifier
        .withArgs(object)
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .teams('snowshoe')
          .then(data => {
            expect(stubs.socket.emit).to.have.been.calledOnce;
            expect(stubs.socket.emit).to.have.been.calledWith('teams', { test: 'succeed' });

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

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .teams('snowshoe')
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
      stubs.rate_notifier
        .withArgs(object)
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .repositories('user/repos')
          .then(data => {
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
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .repositories('user/repos')
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
        .withArgs(object)
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .pulls(repository)
          .then(data => {
            expect(data).to.eql(object.json);
            expect(stubs.socket.emit).to.have.been.calledOnce;
            expect(stubs.socket.emit).to.have.been.calledWith('pulls', object.json);

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
          isTitleDisplayed: false,
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
        .withArgs(object)
        .returns(Promise.resolve(object));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .pulls(repository)
          .then(data => {
            expect(data).to.eql(expected);
            expect(stubs.socket.emit).to.have.been.calledOnce;
            expect(stubs.socket.emit).to.have.been.calledWith('pulls', expected);

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
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .pulls(repository)
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
        .withArgs(fixtures.issues)
        .returns(Promise.resolve(fixtures.issues));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .issues(repository)
          .then((data) => {
            const issues = fixtures.issues.json.filter(issue => 'pull_request' in issue);

            expect(stubs.socket.emit).to.be.called;
            expect(data).to.eql(issues);

            expect(stubs.socket.emit).to.have.been.calledWith('pulls:issues', issues);
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
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .issues(repository)
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });

  describe('.statuses()', () => {
    it('should returns the list of the last pulls statuses', () => {
      const pulls = [{
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

      pulls.forEach((item, index) => {
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
          .withArgs(item.stub)
          .returns(Promise.resolve(item.stub));
      });

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .statuses(pulls)
          .then(() => {
            expect(stubs.socket.emit).to.be.calledTwice;

            fixtures.status_1.json[0].pull_request = { id: 1 };
            fixtures.status_2.json[0].pull_request = { id: 2 };

            expect(
              stubs.socket.emit.firstCall
                .calledWith('pulls:status', fixtures.status_1.json[0])
            ).to.be.true;
            expect(
              stubs.socket.emit.secondCall
                .calledWith('pulls:status', fixtures.status_2.json[0])
            ).to.be.true;

            resolve();
          })
          .catch(error => {reject(error.stack.split(`\n`)); });
      });
    });
    it('should reject the promise on error', () => {
      const pulls = [{
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
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise((resolve, reject) => {
        fetcher(stubs.socket, 'test_token')
          .statuses(pulls)
          .then(() => reject(new Error('Promise should have been rejected')))
          .catch(resolve);
      });
    });
  });
});
