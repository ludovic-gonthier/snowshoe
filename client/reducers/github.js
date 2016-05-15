import { default as _ } from 'lodash';
import {
  SOCKET_DATA_RECEIVED,
} from '../actions';

export const initialState = {
  organizations: [],
  pulls: [],
  rate: {},
  teams: [],
  token: '',
  user: null,
};

function organizations(state = initialState.organizations, action) {
  if (!action.message || action.message !== 'organizations') {
    return state || initialState.organizations;
  }

  return action.data;
}

function pulls(state = initialState.pulls, action) {
  if (!action.message || action.message.indexOf('pulls') === -1) {
    return state || initialState.pulls;
  }

  const [, type = 'add'] = action.message.split(':');

  switch (type) {
    case 'add':
      return (() => {
        const updated = _.filter(state, (stpull) => {
          if (action.data.repo !== stpull.base.repo.full_name) {
            return true;
          }

          return !!_.filter(action.data.pulls, (acpull) => acpull.id === stpull.id).length;
        });
        const ids = _.map(updated, 'id');

        _.forEach(action.data.pulls, (pull) => {
          const index = ids.indexOf(pull.id);

          if (index === -1) {
            updated.push(pull);
          } else {
            updated[index] = _.assign({}, updated[index], pull);
          }
        });

        return _.orderBy(updated, action.data.sort.key, action.data.sort.direction);
      })();
    case 'issues':
      return ((urls) => _.map(state, (pull) => {
        const index = urls.indexOf(pull.url);

        if (index !== -1) {
          return Object.assign(
            {},
            pull,
            {
              labels: action.data[index].labels,
              comments: action.data[index].comments,
            }
          );
        }

        return pull;
      }))(_.map(action.data, (issue) => issue.pull_request.url));
    case 'status':
      return ((ids) => _.map(state, (pull) => {
        const index = ids.indexOf(pull.id);

        if (index !== -1) {
          return Object.assign({}, pull, { status: action.data[index] });
        }

        return pull;
      }))(_.map(action.data, (status) => status.pull_request.id));
    default:
      return state;
  }
}

function rate(state = initialState.rate, action) {
  if (!action.message || action.message !== 'rate') {
    return state || initialState.rate;
  }

  return Object.assign({}, action.data, { reset: new Date(action.data.reset * 1000) });
}

function teams(state = initialState, action) {
  if (!action.message || action.message !== 'teams') {
    return state.teams || initialState.teams;
  }

  return action.data.map((team) => {
    let href = `/teams/${team.slug}/${team.id}`;

    if (!state.user && state.token) {
      href += `?access_token=${state.token}`;
    }

    return Object.assign(
      {},
      team,
      { href }
    );
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SOCKET_DATA_RECEIVED:
      return {
        organizations: organizations(state.organizations, action),
        pulls: pulls(state.pulls, action),
        rate: rate(state.rate, action),
        teams: teams(state, action),
        token: !action.token ? state.token || initialState.token : action.token,
        user: !action.user ? state.user || initialState.user : action.user,
      };
    default:
      return state;
  }
};
