import {
  NOTIFY_RATE,
  RECEIVED_ORGANIZATIONS,
  RECEIVED_PULLS,
  RECEIVED_PULLS_ISSUES,
  RECEIVED_PULLS_STATUSES,
  RECEIVED_TEAMS,
} from 'actions';

import pulls from 'reducers/github/pulls';
import pullsIssues from 'reducers/github/pulls-issues';
import pullsStatuses from 'reducers/github/pulls-statuses';

export const initialState = {
  organizations: [],
  pulls: [],
  rate: {},
  teams: [],
  token: '',
  user: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFY_RATE:
      return Object.assign(
        {},
        state,
        {
          rate: Object.assign(
            {},
            action.rate,
            { reset: new Date(action.rate.reset * 1000) },
          ),
        },
      );
    case RECEIVED_ORGANIZATIONS:
      return Object.assign({}, state, { organizations: action.organizations });
    case RECEIVED_PULLS:
      return Object.assign({}, state, { pulls: pulls(state.pulls, action) });
    case RECEIVED_PULLS_ISSUES:
      return Object.assign({}, state, { pulls: pullsIssues(state.pulls, action) });
    case RECEIVED_PULLS_STATUSES:
      return Object.assign({}, state, { pulls: pullsStatuses(state.pulls, action) });
    case RECEIVED_TEAMS:
      return Object.assign(
        {},
        state,
        {
          teams: action.teams.map((team) => {
            let href = `/teams/${team.slug}/${team.id}`;

            if (!state.user && state.token) {
              href += `?access_token=${state.token}`;
            }

            return Object.assign({}, team, { href });
          }),
        },
      );
    default:
      return state;
  }
};
