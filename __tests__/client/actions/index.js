import * as actions from 'actions/index';

describe('actions', () => {
  it('.receivedDataFromSocket() return correct data', () => {
    const data = { foo: 'bar' };
    const message = 'the message';
    const result = actions.receivedDataFromSocket(message, data);

    expect(result)
      .toEqual({
        type: actions.SOCKET_DATA_RECEIVED,
        data,
        message,
      });
  });

  it('.emitDataToSocket() return correct data', () => {
    const data = { foo: 'bar' };
    const message = 'the message';
    const result = actions.emitDataToSocket(message, data);

    expect(result)
      .toEqual({
        type: actions.SOCKET_DATA_EMIT,
        data,
        message,
      });
  });

  it('.filterByLabels() return correct data', () => {
    const label = 'the label';
    const result = actions.filterByLabels(label);

    expect(result)
      .toEqual({
        type: actions.FILTER_BY_LABELS,
        label,
      });
  });

  it('.receivedOrgnizations() return correct data', () => {
    const organizations = { organizations: [] };
    const token = 'test_token';
    const result = actions.receivedOrgnizations(organizations, token);

    expect(result)
      .toEqual({
        action: {
          type: actions.RECEIVED_ORGANIZATIONS,
          organizations,
        },
        token,
      });
  });

  it('.receivedTeams() return correct data', () => {
    const teams = { teams: [] };
    const token = 'test_token';
    const result = actions.receivedTeams(teams, token);

    expect(result)
      .toEqual({
        action: {
          type: actions.RECEIVED_TEAMS,
          teams,
        },
        token,
      });
  });

  it('.receivedPulls() return correct data', () => {
    const pulls = { pulls: [] };
    const token = 'test_token';
    const result = actions.receivedPulls(pulls, token);

    expect(result)
      .toEqual({
        action: {
          type: actions.RECEIVED_PULLS,
          data: pulls,
        },
        token,
      });
  });

  it('.receivedPullsStatuses() return correct data', () => {
    const statuses = { status: [] };
    const token = 'test_token';
    const result = actions.receivedPullsStatuses(statuses, token);

    expect(result)
      .toEqual({
        action: {
          type: actions.RECEIVED_PULLS_STATUSES,
          statuses,
        },
        token,
      });
  });

  it('.receivedPullsIssues() return correct data', () => {
    const issues = { issues: [] };
    const token = 'test_token';
    const result = actions.receivedPullsIssues(issues, token);

    expect(result)
      .toEqual({
        action: {
          type: actions.RECEIVED_PULLS_ISSUES,
          issues,
        },
        token,
      });
  });

  it('.receivedPullsReviews() return correct data', () => {
    const reviews = { reviews: [] };
    const token = 'test_token';
    const result = actions.receivedPullsReviews(reviews, token);

    expect(result)
      .toEqual({
        action: {
          type: actions.RECEIVED_PULLS_REVIEWS,
          reviews,
        },
        token,
      });
  });

  it('.notifyRate() return correct data', () => {
    const rate = { limit: 0 };
    const token = 'test_token';
    const result = actions.notifyRate(rate, token);

    expect(result)
      .toEqual({
        action: {
          type: actions.NOTIFY_RATE,
          rate,
        },
        token,
      });
  });

  it('.changeOrderDirection() return correct data', () => {
    const direction = 'desc';
    const result = actions.changeOrderDirection(direction);

    expect(result)
      .toEqual({
        type: actions.CHANGE_ORDER_DIRECTION,
        direction,
      });
  });

  it('.changeOrderField() return correct data', () => {
    const field = 'label';
    const result = actions.changeOrderField(field);

    expect(result)
      .toEqual({
        type: actions.CHANGE_ORDER_FIELD,
        field,
      });
  });
});
