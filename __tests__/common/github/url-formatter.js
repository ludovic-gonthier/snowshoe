import formatter from '../../../common/github/url-formatter';

describe('url-formatter', () => {
  describe('.format()', () => {
    it('should build full url with empty options.', () => {
      expect(formatter('/user/orgs', {}))
        .toEqual('https://api.github.com/user/orgs');
    });

    it('should build full url with per_page option.', () => {
      expect(formatter('/user/orgs', { per_page: 100 }))
        .toEqual('https://api.github.com/user/orgs?per_page=100');
    });

    it('should build full url ignoring unwanted options.', () => {
      expect(formatter('/user/orgs', { foobar: 'baz' }))
        .toEqual('https://api.github.com/user/orgs');
    });

    it('should return full url when it already begins with "http".', () => {
      expect(formatter('http://api.foobar.com/user/orgs', {}))
        .toEqual('http://api.foobar.com/user/orgs');
    });

    it('should remove number and sha token.', () => {
      expect(formatter('/user/orgs{/number}{/sha}', {}))
        .toEqual('https://api.github.com/user/orgs');
    });

    it('should merge an existing querystring with the passed options.', () => {
      expect(formatter('/user/repos?affiliation=collaborator', { per_page: 100 }))
        .toEqual('https://api.github.com/user/repos?affiliation=collaborator&per_page=100');
    });
  });
});

