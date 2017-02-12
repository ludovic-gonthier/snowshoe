export default function pullsStatuses(state, action) {
  const ids = action.statuses.map((status) => status.pull_request.id);

  return state.map((pull) => {
    const index = ids.indexOf(pull.id);

    if (index !== -1) {
      const statuses = action.statuses[index].statuses || [];

      return Object.assign(
        {},
        pull,
        {
          status: Object.assign(
            {},
            action.statuses[index],
            { statuses: statuses.sort((a, b) => a.context >= b.context) }
          ),
        }
      );
    }

    return pull;
  });
}
