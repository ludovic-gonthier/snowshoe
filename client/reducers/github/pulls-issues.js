import _ from 'lodash';

export default function pullsIssues(state, action) {
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
        },
      );
    }

    return pull;
  });
}
