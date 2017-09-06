import picker from '../../../common/github/object-picker';

import filter from '../../../common/github/result-filter';

jest.mock('../../../common/github/object-picker', () => jest.fn());

describe('result-filter', () => {
  describe('.filter()', () => {
    beforeEach(() => {
      picker.mockReset();
    });

    it('should throws error if no schema type defined.', () => {
      expect(() => filter({}, 'undefined'))
        .toThrowError('No "undefined" schema defined in "config/object/"');
    });

    it('should call filter a data object', () => {
      const expected = { pulls_url: 'my_url' };

      picker.mockImplementationOnce(() => expected);

      const result = filter({ foo: 'bar', pulls_url: 'my_url' }, 'repository');

      expect(result)
        .toEqual(expected);
    });

    it('should call filter a data array', () => {
      picker.mockImplementationOnce(() => ({ pulls_url: 'my_url' }));
      picker.mockImplementationOnce(() => ({ issues_url: 'issue_url' }));

      const filtered = filter([
        { foo: 'bar', pulls_url: 'my_url' },
        { issues_url: 'issue_url', blah: 'blah' },
      ], 'repository');

      expect(filtered)
        .toEqual([
          { pulls_url: 'my_url' },
          { issues_url: 'issue_url' },
        ]);

      expect(picker)
        .toHaveBeenCalledTimes(2);
    });
  });
});

