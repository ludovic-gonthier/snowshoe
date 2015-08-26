'use strict';

var picker = require(ROOT_PATH + '/lib/github/object-picker');

describe('object-picker', function () {
  describe('.pick()', function () {
    it('should return the keys present in a single depth map.', function () {
      var object = {
        'a': 42,
        'b': 'leet',
        'c': 'test',
        'foo': 'foo',
        'bar': 'bar'
      };
      var map = ['a', 'foo', 'b'];
      var expected = {
        'a': 42,
        'b': 'leet',
        'foo': 'foo'
      };

      expect(picker(object, map)).to.eql(expected);
    });

    it('should return the keys present in map containing a simple object.', function () {
      var object = {
        'a': 42,
        'b': 'leet',
        'c': 'test',
        'foo': {
          'bar': 'bar',
          'notbar': 'bar'
        }
      };
      var map = ['a', { 'foo': 'bar' }, 'b'];
      var expected = {
        'a': 42,
        'b': 'leet',
        'foo': {
          'bar': 'bar'
        }
      };

      expect(picker(object, map)).to.eql(expected);
    });

    it('should return the keys present in map containing a complex object.', function () {
      var object = {
        first_key: {
          nested_key: {
            deeply_nested_key: [
              {
                id: 42,
                name: 'foo'
              },
              {
                id: 1337,
                name: 'leet'
              }
            ],
            unwanted_deeply_nested_key: [
              {
                id: 87,
                name: 'error'
              }
            ]
          },
          unwanted_nested_key: 'foobar',
          nested_wanted_key: 'wanted'
        },
        second_key: 'simple_value',
        unwanted: 'error',
        third_key: [1, 2, 3]
      };
      var map = [
        {
          'first_key': [
          {
            'nested_key': {
              'deeply_nested_key': ['id', 'name'],
            }
          },
          'nested_wanted_key'
          ]
        },
        'second_key',
        'third_key'
      ];
      var expected = {
        first_key: {
          nested_key: {
            deeply_nested_key: [
              {
                id: 42,
                name: 'foo'
              },
              {
                id: 1337,
                name: 'leet'
              }
            ]
          },
          nested_wanted_key: 'wanted'
        },
        second_key: 'simple_value',
        third_key: [1, 2, 3]
      };

      expect(picker(object, map)).to.eql(expected);
    });
  });
});
