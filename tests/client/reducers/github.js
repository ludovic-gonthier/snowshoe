/* global beforeEach, describe, expect, it, sinon */
/* eslint-disable no-unused-expressions */
import { default as reducer } from '../../../client/reducers/github';
import {
  SOCKET_DATA_RECEIVED,
} from '../../../client/actions';

describe('reducer', () => {
  describe('.pulls()', () => {
    it('should add pulls to state', () => {
      const state = {};
      const action = {
        type: SOCKET_DATA_RECEIVED,
        message: 'pulls',
        data: {
          pulls: [{
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
          }],
          repo: 'lemonde/lemonde',
          sort: {
            key: 'updated_at',
            direction: 'asc',
          },
        },
      };
      const result = reducer(state, action);
      const expected = [{
        base: { repo: { full_name: 'lemonde/lemonde' } },
        id: 23,
        name: 'new 23',
      }];

      expect(result.pulls).to.eql(expected);
    });

    it('should conserve pulls on consecutive calls', () => {
      const state = {
        pulls: [{
          base: { repo: { full_name: 'lemonde/php-command' } },
          id: 513,
          name: 'PHPCOMMAND project 513',
        }, {
          base: { repo: { full_name: 'lemonde/lemonde' } },
          id: 23,
          name: 'new 23',
        }],
      };
      const action = {
        type: SOCKET_DATA_RECEIVED,
        message: 'pulls',
        data: {
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
          }],
          repo: 'lemonde/php-command',
          sort: {
            key: 'updated_at',
            direction: 'asc',
          },
        },
      };
      const result = reducer(state, action);
      const expected = [{
        base: { repo: { full_name: 'lemonde/php-command' } },
        id: 513,
        name: 'PHPCOMMAND project 513',
      }, {
        base: { repo: { full_name: 'lemonde/lemonde' } },
        id: 23,
        name: 'new 23',
      }];

      expect(result.pulls).to.eql(expected);
    });

    it('should remove pulls when no pulls for repository on reduce call', () => {
      const state = {
        pulls: [{
          base: { repo: { full_name: 'lemonde/php-command' } },
          id: 513,
          name: 'PHPCOMMAND project 513',
        }, {
          base: { repo: { full_name: 'lemonde/lemonde' } },
          id: 23,
          name: 'new 23',
        }],
      };
      const action = {
        type: SOCKET_DATA_RECEIVED,
        message: 'pulls',
        data: {
          pulls: [],
          repo: 'lemonde/php-command',
          sort: {
            key: 'updated_at',
            direction: 'asc',
          },
        },
      };
      const result = reducer(state, action);
      const expected = [{
        base: { repo: { full_name: 'lemonde/lemonde' } },
        id: 23,
        name: 'new 23',
      }];

      expect(result.pulls).to.eql(expected);
    });

    it('should remove pulls when pulls not present in repository on reduce call', () => {
      const state = {
        pulls: [{
          base: { repo: { full_name: 'lemonde/php-command' } },
          id: 513,
          name: 'PHPCOMMAND project 513',
        }, {
          base: { repo: { full_name: 'lemonde/php-command' } },
          id: 512,
          name: 'PHPCOMMAND project 512',
        }, {
          base: { repo: { full_name: 'lemonde/lemonde' } },
          id: 23,
          name: 'new 23',
        }],
      };
      const action = {
        type: SOCKET_DATA_RECEIVED,
        message: 'pulls',
        data: {
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
          }],
          repo: 'lemonde/php-command',
          sort: {
            key: 'updated_at',
            direction: 'asc',
          },
        },
      };
      const result = reducer(state, action);
      const expected = [{
        base: { repo: { full_name: 'lemonde/php-command' } },
        id: 513,
        name: 'PHPCOMMAND project 513',
      }, {
        base: { repo: { full_name: 'lemonde/lemonde' } },
        id: 23,
        name: 'new 23',
      }];

      expect(result.pulls).to.eql(expected);
    });

    it('should remove pulls in repository on reduce call', () => {
      const state = {
        pulls: [{
          base: { repo: { full_name: 'lemonde/php-command' } },
          id: 513,
          name: 'PHPCOMMAND project 513',
        }, {
          base: { repo: { full_name: 'lemonde/php-command' } },
          id: 512,
          name: 'PHPCOMMAND project 512',
        }, {
          base: { repo: { full_name: 'lemonde/lemonde' } },
          id: 23,
          name: 'new 23',
        }],
      };
      const action = {
        type: SOCKET_DATA_RECEIVED,
        message: 'pulls',
        data: {
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 512,
            name: 'PHPCOMMAND modified project 512',
          }, {
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 511,
            name: 'PHPCOMMAND project 511',
          }],
          repo: 'lemonde/php-command',
          sort: {
            key: 'updated_at',
            direction: 'asc',
          },
        },
      };
      const result = reducer(state, action);
      const expected = [{
        base: { repo: { full_name: 'lemonde/php-command' } },
        id: 512,
        name: 'PHPCOMMAND modified project 512',
      }, {
        base: { repo: { full_name: 'lemonde/lemonde' } },
        id: 23,
        name: 'new 23',
      }, {
        base: { repo: { full_name: 'lemonde/php-command' } },
        id: 511,
        name: 'PHPCOMMAND project 511',
      }];

      expect(result.pulls).to.eql(expected);
    });
  });
});
