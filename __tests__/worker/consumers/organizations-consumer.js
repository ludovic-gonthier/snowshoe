import { receivedOrgnizations } from '../../../client/actions';
import rabbit from '../../../common/rabbit';
import { organizations as fetchOrganizations } from '../../../common/github/fetcher';
import rateNotifier from '../../../common/github/rate-notifier';

import consumer from '../../../worker/consumers/organizations-consumer';

jest.mock('../../../client/actions', () => ({
  receivedOrgnizations: jest.fn(),
}));
jest.mock('../../../common/rabbit', () => ({
  produce: jest.fn(),
}));
jest.mock('../../../common/github/fetcher', () => ({
  organizations: jest.fn(),
}));
jest.mock('../../../common/github/rate-notifier', () => jest.fn());

describe('[Consumers - organization]', () => {
  const token = '12345';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch organizations', () => {
    fetchOrganizations.mockImplementationOnce(() => Promise.resolve({}));

    consumer(token)
      .then(() => {
        expect(fetchOrganizations)
          .toHaveBeenCalledWith(token);
      });
  });

  it('should produce the fetched organizations', () => {
    fetchOrganizations.mockImplementationOnce(() => Promise.resolve({ json: {} }));
    receivedOrgnizations.mockImplementationOnce((json) => json);

    consumer(token)
      .then(() => {
        expect(rabbit.produce)
          .toHaveBeenCalledWith('snowshoe', 'response', '{}');
      });
  });

  it('should notify rate', () => {
    fetchOrganizations.mockImplementationOnce(() => Promise.resolve({ json: {} }));
    receivedOrgnizations.mockImplementationOnce((json) => json);

    consumer(token)
      .then(() => {
        expect(rateNotifier)
          .toHaveBeenCalledWith(token, { json: {} });
      });
  });
});
