'use strict';

var Promise = require('promise');

var fixtures = require(ROOT_PATH + '/tests/fixtures/lib/github/fetcher.json');
var stubs = {
  rate_notifier: sinon.stub(),
  request: {
    paginate: sinon.stub(),
    call: sinon.stub()
  },
  socket: {
    emit: sinon.stub()
  },
  url_formatter: sinon.stub(),
};

var rateNotifierStub = sinon.stub();
var requestStub = sinon.stub();

var fetcher = proxyquire(ROOT_PATH + '/lib/github/fetcher', {
  './rate-notifier': rateNotifierStub,
  './request': requestStub,
  './url-formatter': stubs.url_formatter
});

describe('fetcher', function () {
  beforeEach(function () {
    stubs.socket.emit.reset();
    stubs.url_formatter.reset();
    stubs.rate_notifier.reset();
    stubs.request.paginate.reset();
    stubs.request.call.reset();
  });

  describe('.organizations()', function () {
    it('should returns a list of organization', function () {
      var object = {json: {test: 'succeed'}};

      stubs.url_formatter
        .withArgs('/user/orgs', {per_page: 100})
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .organizations()
          .then(function (data) {
            expect(stubs.socket.emit).to.have.been.calledOnce;
            expect(stubs.socket.emit).to.have.been.calledWith('organizations', {test: 'succeed'});

            expect(data).to.eql({test: 'succeed'});
            resolve();
        }).catch(reject);
      });
    });
    it('should reject the promise on error', function () {
      stubs.url_formatter
        .withArgs('/user/orgs', {per_page: 100})
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .organizations()
          .then(function (data) {
            reject(new Error('Promise should have been rejected'));
            expect(stubs.socket.emit).to.have.been.calledTwice;
            expect(stubs.socket.emit).to.have.been.calledWith('organizations', {test: 'succeed'});
        }).catch(resolve);
      });
    });
  });

  describe('.teams()', function () {
    it('should returns a list of team', function () {
      var object = {json: {test: 'succeed'}};

      stubs.url_formatter
        .withArgs('orgs/snowshoe/teams', {per_page: 100})
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .teams('snowshoe')
          .then(function (data) {
            expect(stubs.socket.emit).to.have.been.calledOnce;
            expect(stubs.socket.emit).to.have.been.calledWith('teams', {test: 'succeed'});

            expect(data).to.eql({test: 'succeed'});
            resolve();
        }).catch(reject);
      });
    });
    it('should reject the promise on error', function () {
      stubs.url_formatter
        .withArgs('orgs/snowshoe/teams', {per_page: 100})
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .teams('snowshoe')
          .then(function (data) {
            reject(new Error('Promise should have been rejected'));
        }).catch(resolve);
      });
    });
  });

  describe('.repositories()', function () {
    it('should returns a list of team', function () {
      var object = {json: {test: 'succeed'}};

      stubs.url_formatter
        .withArgs('user/repos', {per_page: 100})
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .repositories('user/repos')
          .then(function (data) {
            expect(data).to.eql({test: 'succeed'});
            resolve();
        }).catch(reject);
      });
    });
    it('should reject the promise on error', function () {
      stubs.url_formatter
        .withArgs('user/repos', {per_page: 100})
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .repositories('user/repos')
          .then(function (data) {
            reject(new Error('Promise should have been rejected'));
        }).catch(resolve);
      });
    });
  });

  describe('.pulls()', function () {
    it('should returns a list of pull request', function () {
      var object = fixtures.pulls_simple;
      var repository = {
        pulls_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}'
      };

      stubs.url_formatter
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}', {per_page: 100})
        .returns('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100');
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .pulls(repository)
          .then(function (data) {
            expect(data).to.eql(object.json);
            expect(stubs.socket.emit).to.have.been.calledOnce;
            expect(stubs.socket.emit).to.have.been.calledWith('pulls', object.json);

            resolve();
        }).catch(reject);
      });
    });
    it('should not returns locked pull requests', function () {
      var object = fixtures.pulls_with_locked;
      var expected = [
        {
          "base" : {
            "repo": {
              "name": "goul-registry"
            }
          },
          "id": 36567207,
          "isTitleDisplayed": false,
          "locked": false,
          "number": 3,
          "title": "refactor: remove dead code",
          "url": "https://api.github.com/repos/ludovic-gonthier/goul-registry/pulls/3",
          "user": {
            "login": "ludovic-gonthier",
            "avatar_url": "https://avatars.githubusercontent.com/u/2995136?v=3"
          },
          "html_url": "https://github.com/ludovic-gonthier/goul-registry/pull/3"
        }
      ];
      var repository = {
        pulls_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}'
      };

      stubs.url_formatter
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}', {per_page: 100})
        .returns('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100');
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .pulls(repository)
          .then(function (data) {
            expect(data).to.eql(expected);
            expect(stubs.socket.emit).to.have.been.calledOnce;
            expect(stubs.socket.emit).to.have.been.calledWith('pulls', expected);

            resolve();
        }).catch(reject);
      });
    });
    it('should reject the promise on error', function () {
      var repository = {
        pulls_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}'
      };

      stubs.url_formatter
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls{/number}', {per_page: 100})
        .returns('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/pulls?per_page=100', 'pull')
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .pulls(repository)
          .then(function (data) {
            reject(new Error('Promise should have been rejected'));
        }).catch(resolve);
      });
    });
  });

  describe('.issues()', function () {
    it('should returns the issue linked to the repository', function () {
      var repository = {
        issues_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues{/number}'
      };

      stubs.url_formatter
          .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues{/number}', {per_page: 100})
          .returns('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100');
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .issues(repository)
          .then(function (data) {
            var issues = fixtures.issues.json.filter(function (issue) {
               return 'pull_request' in issue;
            });

            expect(stubs.socket.emit).to.be.called;
            expect(data).to.eql(issues);

            expect(stubs.socket.emit).to.have.been.calledWith('pulls:issues', issues);
            resolve();
        }).catch(reject);
      });
    });

    it('should reject the promise on error', function () {
      var repository = {
        issues_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/issues{/number}'
      };

      stubs.url_formatter
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues', {per_page: 100})
        .returns('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100');
      stubs.request.paginate
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/issues?per_page=100', 'issue')
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .issues(repository)
          .then(function (data) {
            reject(new Error('Promise should have been rejected'));
        }).catch(resolve);
      });
    });
  });

  describe('.statuses()', function () {
    it('should returns the list of the last pulls statuses', function () {
      var pulls = [{
        id: 1,
        statuses_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/0',
        stub: fixtures.status_1
      }, {
        id: 2,
        statuses_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/1',
        stub: fixtures.status_2
      }, {
        id: 3,
        statuses_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/2',
        stub: fixtures.status_3
      }];

      pulls.forEach(function (item, index) {
        stubs.url_formatter
          .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/' + index, {per_page: 1})
          .returns('https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/' + index + '?per_page=1');
        stubs.request.call
          .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/' + index + '?per_page=1', 'status')
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

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .statuses(pulls)
          .then(function () {
            expect(stubs.socket.emit).to.be.calledTwice;

            fixtures.status_1.json[0].pull_request = { id : 1 };
            fixtures.status_2.json[0].pull_request = { id : 2 };

            expect(stubs.socket.emit.firstCall.calledWith('pulls:status', fixtures.status_1.json[0])).to.be.true;
            expect(stubs.socket.emit.secondCall.calledWith('pulls:status', fixtures.status_2.json[0])).to.be.true;

            resolve();
        }).catch(function (error) {reject(error.stack.split("\n")); });
      });
    });
    it('should reject the promise on error', function () {
      var pulls = [{
        statuses_url: 'https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/'
      }];
      stubs.url_formatter
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/', {per_page: 1})
        .returns('https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/?per_page=1');
      stubs.request.call
        .withArgs('https://api.github.com/repos/ludovic-gonthier/snowshoe/statuses/?per_page=1', 'status')
        .returns(Promise.reject(new Error('Pagination error')));

      requestStub
        .withArgs('test_token')
        .returns(stubs.request);
      rateNotifierStub
        .withArgs(stubs.socket)
        .returns(stubs.rate_notifier);

      return new Promise(function (resolve, reject) {
        fetcher(stubs.socket, 'test_token')
          .statuses(pulls)
          .then(function (data) {
            reject(new Error('Promise should have been rejected'));
        }).catch(resolve);
      });
    });
  });
});
