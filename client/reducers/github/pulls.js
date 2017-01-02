import _ from 'lodash';

import { initialState } from '../github';

export default function pulls(state = initialState.pulls, action) {
  const updated = _.filter(state, (stpull) => {
    if (action.data.repo !== stpull.base.repo.full_name) {
      return true;
    }

    return !!_.filter(action.data.pulls, acpull => acpull.id === stpull.id).length;
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

  return updated;
}

