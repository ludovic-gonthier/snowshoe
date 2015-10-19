'use strict';

var formatter = require(ROOT_PATH + '/lib/github/url-formatter');

describe('url-formatter', function () {
  describe('.format()', function () {
    it('should build full url with empty options.', function () {
      expect(formatter('/user/orgs', {})).to.eq('https://api.github.com/user/orgs');
    });

    it('should build full url with per_page option.', function () {
      expect(formatter('/user/orgs', {per_page: 100})).to.eq('https://api.github.com/user/orgs?per_page=100');
    });

    it('should build full url ignoring unwanted options.', function () {
      expect(formatter('/user/orgs', {foobar: 'baz'})).to.eq('https://api.github.com/user/orgs');
    });

    it('should return full url when it already begins with "http".', function () {
      expect(formatter('http://api.foobar.com/user/orgs', {})).to.eq('http://api.foobar.com/user/orgs');
    });

    it('should remove number and sha token.', function () {
      expect(formatter('/user/orgs{/number}{/sha}', {})).to.eq('https://api.github.com/user/orgs');
    });

    it('should merge an existing querystring with the passed options.', function () {
      expect(formatter('/user/repos?affiliation=collaborator', {per_page: 100})).to.eq('https://api.github.com/user/repos?affiliation=collaborator&per_page=100');
    });
  });
});
