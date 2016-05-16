import _ from 'lodash';

import { initialState } from '../github';

export function pullsIssues(state = initialState.pulls, action) {
  console.dir(action);
  const urls = _.map(action.issues, (issue) => issue.pull_request.url);

  return _.map(state, (pull) => {
    const index = urls.indexOf(pull.url);

    if (index !== -1) {
      return Object.assign(
        {},
        pull,
        {
          labels: action.issues[index].labels,
          comments: action.issues[index].comments,
        }
      );
    }

    return pull;
  });
}
