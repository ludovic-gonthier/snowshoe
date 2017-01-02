/* global describe, expect, it, proxyquire, ROOT_PATH, sinon */
const objectsTub = sinon.stub();
const filter = proxyquire(`${ROOT_PATH}/common/github/result-filter`, {
  './object-picker': objectsTub,
}).default;

describe('result-filter', () => {
  describe('.filter()', () => {
    it('should throws error if no schema type defined.', () => {
      expect(filter.bind(filter, {}, 'undefined')).to.throw(Error);
    });

    it('should call filter a data object', () => {
      const expected = { pulls_url: 'my_url' };

      objectsTub.returns(expected);

      expect(
        filter({ foo: 'bar', pulls_url: 'my_url' }, 'repository'),
      ).to.eql(expected);
    });

    it('should call filter a data array', () => {
      objectsTub.withArgs({ foo: 'bar', pulls_url: 'my_url' })
        .returns({ pulls_url: 'my_url' });
      objectsTub.withArgs({ issues_url: 'issue_url', blah: 'blah' })
        .returns({ issues_url: 'issue_url' });

      const filtered = filter([
        { foo: 'bar', pulls_url: 'my_url' },
        { issues_url: 'issue_url', blah: 'blah' },
      ], 'repository');

      expect(filtered).to.eql([
        { pulls_url: 'my_url' },
        { issues_url: 'issue_url' },
      ]);
    });
  });
});
