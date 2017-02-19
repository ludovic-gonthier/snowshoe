export const SOCKET_DATA_RECEIVED = 'SOCKET_DATA_RECEIVED';
export function receivedDataFromSocket(message, data) {
  return {
    type: SOCKET_DATA_RECEIVED,
    data,
    message,
  };
}

export const SOCKET_DATA_EMIT = 'SOCKET_DATA_EMIT';
export function emitDataToSocket(message, data) {
  return {
    type: SOCKET_DATA_EMIT,
    data,
    message,
  };
}

export const FILTER_BY_LABELS = 'FILTER_BY_LABELS';
export function filterByLabels(label) {
  return {
    type: FILTER_BY_LABELS,
    label,
  };
}

export const RECEIVED_ORGANIZATIONS = 'RECEIVED_ORGANIZATIONS';
export function receivedOrgnizations(organizations, token) {
  return {
    action: {
      type: RECEIVED_ORGANIZATIONS,
      organizations,
    },
    token,
  };
}

export const RECEIVED_TEAMS = 'RECEIVED_TEAMS';
export function receivedTeams(teams, token) {
  return {
    action: {
      type: RECEIVED_TEAMS,
      teams,
    },
    token,
  };
}

export const RECEIVED_PULLS = 'RECEIVED_PULLS';
export function receivedPulls(data, token) {
  return {
    action: {
      type: RECEIVED_PULLS,
      data,
    },
    token,
  };
}

export const RECEIVED_PULLS_STATUSES = 'RECEIVED_PULLS_STATUSES';
export function receivedPullsStatuses(statuses, token) {
  return {
    action: {
      type: RECEIVED_PULLS_STATUSES,
      statuses,
    },
    token,
  };
}

export const RECEIVED_PULLS_ISSUES = 'RECEIVED_PULLS_ISSUES';
export function receivedPullsIssues(issues, token) {
  return {
    action: {
      type: RECEIVED_PULLS_ISSUES,
      issues,
    },
    token,
  };
}

export const RECEIVED_PULLS_REVIEWS = 'RECEIVED_PULLS_REVIEWS';
export function receivedPullsReviews(reviews, token) {
  return {
    action: {
      type: RECEIVED_PULLS_REVIEWS,
      reviews,
    },
    token,
  };
}

export const NOTIFY_RATE = 'NOTIFY_RATE';
export function notifyRate(rate, token) {
  return {
    action: {
      type: NOTIFY_RATE,
      rate,
    },
    token,
  };
}

export const CHANGE_ORDER_DIRECTION = 'CHANGE_ORDER_DIRECTION';
export function changeOrderDirection(direction) {
  return {
    type: CHANGE_ORDER_DIRECTION,
    direction,
  };
}

export const CHANGE_ORDER_FIELD = 'CHANGE_ORDER_FIELD';
export function changeOrderField(field) {
  return {
    type: CHANGE_ORDER_FIELD,
    field,
  };
}
