import _ from 'lodash';

export default function pullsStatuses(state, action) {
  const ids = _.map(action.statuses, (status) => status.pull_request.id);

  return _.map(state, (pull) => {
    const index = ids.indexOf(pull.id);

    if (index !== -1) {
      return Object.assign({}, pull, { status: action.statuses[index] });
    }

    return pull;
  });
}
