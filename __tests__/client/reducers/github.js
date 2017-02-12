import {
  NOTIFY_RATE,
  RECEIVED_ORGANIZATIONS,
  RECEIVED_PULLS,
  RECEIVED_PULLS_ISSUES,
  RECEIVED_PULLS_STATUSES,
  RECEIVED_TEAMS,
} from 'actions';

import reducer from 'reducers/github';

/**
 * @covers 'reducers/github/pulls-issues'
 * @covers 'reducers/github/pulls-statuses'
 * @covers 'reducers/github/pulls'
 */
describe('[Reducers - github]', () => {
  const state = {
    organizations: [],
    pulls: [],
    rate: {
      remaining: 5000,
      reset: '',
      limit: 5000,
    },
    teams: [{ label: 'team1' }],
    token: '123456789',
    user: {
      login: 'test',
    },
  };

  it('default to initialState when no state given', () => {
    expect(reducer(undefined, { type: '' }))
      .toEqual({
        organizations: [],
        pulls: [],
        rate: {},
        teams: [],
        token: '',
        user: null,
      });
  });

  describe(`on ${NOTIFY_RATE}`, () => {
    it('should update the rate', () => {
      const action = {
        type: NOTIFY_RATE,
        rate: {
          remaining: 4900,
          reset: 1483823218,
          limit: 5000,
        },
      };

      const updated = reducer(state, action);

      expect(updated)
        .toEqual({
          organizations: [],
          pulls: [],
          rate: {
            remaining: 4900,
            reset: new Date(1483823218000),
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });
  });

  describe(`on ${RECEIVED_ORGANIZATIONS}`, () => {
    it('should set the organizations list', () => {
      const action = {
        type: RECEIVED_ORGANIZATIONS,
        organizations: ['org1', 'org2'],
      };
      const updated = reducer(state, action);

      expect(updated)
        .toEqual({
          organizations: ['org1', 'org2'],
          pulls: [],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });
  });

  describe(`on ${RECEIVED_PULLS}`, () => {
    it('should add pulls to state', () => {
      const action = {
        type: RECEIVED_PULLS,
        data: {
          pulls: [{
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
          }],
          repo: 'lemonde/lemonde',
        },
      };
      const result = reducer(state, action);

      expect(result)
        .toEqual({
          organizations: [],
          pulls: [{
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
          }],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });

    it('should conserve pulls on consecutive calls', () => {
      const pulls = [{
        base: { repo: { full_name: 'lemonde/php-command' } },
        id: 513,
        name: 'PHPCOMMAND project 513',
      }, {
        base: { repo: { full_name: 'lemonde/lemonde' } },
        id: 23,
        name: 'new 23',
      }];
      const action = {
        type: RECEIVED_PULLS,
        data: {
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
          }],
          repo: 'lemonde/php-command',
        },
      };
      const result = reducer(Object.assign({}, state, { pulls }), action);

      expect(result)
        .toEqual({
          organizations: [],
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
          }, {
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
          }],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });

    it('should remove pulls when no pulls for repository on reduce call', () => {
      const pulls = [{
        base: { repo: { full_name: 'lemonde/php-command' } },
        id: 513,
        name: 'PHPCOMMAND project 513',
      }, {
        base: { repo: { full_name: 'lemonde/lemonde' } },
        id: 23,
        name: 'new 23',
      }];
      const action = {
        type: RECEIVED_PULLS,
        data: {
          pulls: [],
          repo: 'lemonde/php-command',
        },
      };
      const result = reducer(Object.assign({}, state, { pulls }), action);

      expect(result)
        .toEqual({
          organizations: [],
          pulls: [{
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
          }],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });

    it('should remove pulls when pulls not present in repository on reduce call', () => {
      const pulls = [{
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
      }];
      const action = {
        type: RECEIVED_PULLS,
        data: {
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
          }],
          repo: 'lemonde/php-command',
        },
      };
      const result = reducer(Object.assign({}, state, { pulls }), action);

      expect(result)
        .toEqual({
          organizations: [],
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
          }, {
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
          }],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });

    it('should remove pulls in repository on reduce call', () => {
      const pulls = [{
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
      }];
      const action = {
        type: RECEIVED_PULLS,
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
        },
      };
      const result = reducer(Object.assign({}, state, { pulls }), action);

      expect(result)
        .toEqual({
          organizations: [],
          pulls: [{
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
          }],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });
  });

  describe(`on ${RECEIVED_PULLS_ISSUES}`, () => {
    it('shoul set the labels and comment on pull request', () => {
      const pulls = [{
        base: { repo: { full_name: 'lemonde/php-command' } },
        id: 513,
        name: 'PHPCOMMAND project 513',
        url: 'lemonde/php-command/513',
      }, {
        base: { repo: { full_name: 'lemonde/php-command' } },
        id: 512,
        name: 'PHPCOMMAND project 512',
        url: 'lemonde/php-command/512',
      }, {
        base: { repo: { full_name: 'lemonde/lemonde' } },
        id: 23,
        name: 'new 23',
        url: 'lemonde/lemonde/23',
      }];
      const action = {
        type: RECEIVED_PULLS_ISSUES,
        issues: [{
          pull_request: { url: 'lemonde/lemonde/23' },
          labels: ['status/test'],
          comments: 12,
        }]
      };
      const result = reducer(Object.assign({}, state, { pulls }), action);

      expect(result)
        .toEqual({
          organizations: [],
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
            url: 'lemonde/php-command/513',
          }, {
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 512,
            name: 'PHPCOMMAND project 512',
            url: 'lemonde/php-command/512',
          }, {
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
            url: 'lemonde/lemonde/23',
            labels: ['status/test'],
            comments: 12,
          }],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });
  });

  describe(`on ${RECEIVED_PULLS_STATUSES}`, () => {
    it('should set the status on pull request', () => {
      const pulls = [{
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
      }];
      const action = {
        type: RECEIVED_PULLS_STATUSES,
        statuses: [{
          pull_request: { id: 512 },
          status: 'new status',
        }]
      };
      const result = reducer(Object.assign({}, state, { pulls }), action);

      expect(result)
        .toEqual({
          organizations: [],
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
          }, {
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 512,
            name: 'PHPCOMMAND project 512',
            status: {
              pull_request: { id: 512 },
              status: 'new status',
              statuses: [],
            },
          }, {
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
          }],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });

    it('should sort the status by context', () => {
      const pulls = [{
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
      }];
      const action = {
        type: RECEIVED_PULLS_STATUSES,
        statuses: [{
          pull_request: { id: 512 },
          status: 'new status',
          statuses: [{
            context: 'CI B',
          }, {
            context: 'CI A',
          }, {
            context: 'CI C',
          }],
        }]
      };
      const result = reducer(Object.assign({}, state, { pulls }), action);

      expect(result)
        .toEqual({
          organizations: [],
          pulls: [{
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 513,
            name: 'PHPCOMMAND project 513',
          }, {
            base: { repo: { full_name: 'lemonde/php-command' } },
            id: 512,
            name: 'PHPCOMMAND project 512',
            status: {
              pull_request: { id: 512 },
              status: 'new status',
              statuses: [{
                context: 'CI A',
              }, {
                context: 'CI B',
              }, {
                context: 'CI C',
              }],
            },
          }, {
            base: { repo: { full_name: 'lemonde/lemonde' } },
            id: 23,
            name: 'new 23',
          }],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{ label: 'team1' }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });
  });

  describe(`on ${RECEIVED_TEAMS}`, () => {
    const action = {
      type: RECEIVED_TEAMS,
      teams: [{
        slug: 'team_1',
        id: 42,
      }, {
        slug: 'team_2',
        id: 21,
      }],
    };

    it('should set the teams list', () => {
      const updated = reducer(state, action);

      expect(updated)
        .toEqual({
          organizations: [],
          pulls: [],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{
            slug: 'team_1',
            id: 42,
            href: '/teams/team_1/42',
          }, {
            slug: 'team_2',
            id: 21,
            href: '/teams/team_2/21',
          }],
          token: '123456789',
          user: {
            login: 'test',
          },
        });
    });

    it('should append the access_token when the user is not set', () => {
      const updated = reducer(Object.assign({}, state, { user: null }), action);

      expect(updated)
        .toEqual({
          organizations: [],
          pulls: [],
          rate: {
            remaining: 5000,
            reset: '',
            limit: 5000,
          },
          teams: [{
            slug: 'team_1',
            id: 42,
            href: '/teams/team_1/42?access_token=123456789',
          }, {
            slug: 'team_2',
            id: 21,
            href: '/teams/team_2/21?access_token=123456789',
          }],
          token: '123456789',
          user: null,
        });
    });
  });

  describe('on other actions', () => {
    const updated = reducer(state, { type: '' });
    expect(updated === state)
      .toBe(true);
  });
});
