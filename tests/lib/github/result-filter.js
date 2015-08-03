'use strict';

var picker = require(ROOT_PATH + '/lib/github/object-picker');
var objectsTub = sinon.stub();
var filter = proxyquire(ROOT_PATH + '/lib/github/result-filter', {
  './object-picker': objectsTub
});

describe('result-filter', function () {
  describe('#filter', function () {
    it('should throws error if no schema type defined.', function () {
      expect(filter.bind(filter, {}, 'undefined')).to.throw(Error);
    });

    it('should call filter a data object', function () {
      var expected = {'pulls_url': 'my_url'};
      var filtered;

      objectsTub.returns(expected);

      filtered = filter({'foo': 'bar', 'pulls_url': 'my_url'}, 'repository');
      expect(filtered).to.eql(expected);
    });

    it('should call filter a data array', function () {
      var filtered;

      objectsTub.withArgs({'foo': 'bar', 'pulls_url': 'my_url'}).returns({'pulls_url': 'my_url'});
      objectsTub.withArgs({'issues_url': 'issue_url', 'blah': 'blah'}).returns({'issues_url': 'issue_url'});

      filtered = filter([
        {'foo': 'bar', 'pulls_url': 'my_url'},
        {'issues_url': 'issue_url', 'blah': 'blah'}
      ], 'repository');

      expect(filtered).to.eql([
        {'pulls_url': 'my_url'},
        {'issues_url': 'issue_url'}
      ]);
    });
  });
});
