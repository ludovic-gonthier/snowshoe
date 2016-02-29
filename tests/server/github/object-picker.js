/* global describe, expect, it, proxyquire, ROOT_PATH, sinon */
import picker from '../../../server/github/object-picker';

describe('object-picker', () => {
  describe('.pick()', () => {
    it('should return the keys present in a single depth map.', () => {
      const object = {
        a: 42,
        b: 'leet',
        c: 'test',
        foo: 'foo',
        bar: 'bar',
      };
      const map = ['a', 'foo', 'b'];
      const expected = {
        a: 42,
        b: 'leet',
        foo: 'foo',
      };

      expect(picker(object, map)).to.eql(expected);
    });

    it(
      'should return the keys present in map containing a simple object.',
      () => {
        const object = {
          a: 42,
          b: 'leet',
          c: 'test',
          foo: {
            bar: 'bar',
            notbar: 'bar',
          },
        };
        const map = ['a', { foo: 'bar' }, 'b'];
        const expected = {
          a: 42,
          b: 'leet',
          foo: {
            bar: 'bar',
          },
        };

        expect(picker(object, map)).to.eql(expected);
      }
    );

    it(
      'should return the keys present in map containing a complex object.',
      () => {
        const object = {
          first_key: {
            nested_key: {
              deeply_nested_key: [
                {
                  id: 42,
                  name: 'foo',
                },
                {
                  id: 1337,
                  name: 'leet',
                },
              ],
              unwanted_deeply_nested_key: [
                {
                  id: 87,
                  name: 'error',
                },
              ],
            },
            unwanted_nested_key: 'foobar',
            nested_wanted_key: 'wanted',
          },
          second_key: 'simple_value',
          unwanted: 'error',
          third_key: [1, 2, 3],
        };
        const map = [
          {
            first_key: [
              {
                nested_key: {
                  deeply_nested_key: ['id', 'name'],
                },
              },
              'nested_wanted_key',
            ],
          },
          'second_key',
          'third_key',
        ];
        const expected = {
          first_key: {
            nested_key: {
              deeply_nested_key: [
                {
                  id: 42,
                  name: 'foo',
                },
                {
                  id: 1337,
                  name: 'leet',
                },
              ],
            },
            nested_wanted_key: 'wanted',
          },
          second_key: 'simple_value',
          third_key: [1, 2, 3],
        };

        expect(picker(object, map)).to.eql(expected);
      }
    );
  });
});
