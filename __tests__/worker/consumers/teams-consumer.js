import { receivedTeams } from '../../../client/actions';
import rabbit from '../../../common/rabbit';
import { teams as fetchTeams } from '../../../common/github/fetcher';
import rateNotifier from '../../../common/github/rate-notifier';

import consumer from '../../../worker/consumers/teams-consumer';

jest.mock('../../../client/actions', () => ({
  receivedTeams: jest.fn(),
}));
jest.mock('../../../common/rabbit', () => ({
  produce: jest.fn(),
}));
jest.mock('../../../common/github/fetcher', () => ({
  teams: jest.fn(),
}));
jest.mock('../../../common/github/rate-notifier', () => jest.fn());

describe('[Consumers - organization]', () => {
  const token = '12345';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch teams', () => {
    fetchTeams.mockImplementationOnce(() => Promise.resolve({}));

    consumer(token)
      .then(() => {
        expect(fetchTeams)
          .toHaveBeenCalledWith(token);
      });
  });

  it('should produce the fetched teams', () => {
    fetchTeams.mockImplementationOnce(() => Promise.resolve({ json: {} }));
    receivedTeams.mockImplementationOnce((json) => json);

    consumer(token)
      .then(() => {
        expect(rabbit.produce)
          .toHaveBeenCalledWith('snowshoe', 'response', '{}');
      });
  });

  it('should notify rate', () => {
    fetchTeams.mockImplementationOnce(() => Promise.resolve({ json: {} }));
    receivedTeams.mockImplementationOnce((json) => json);

    consumer(token)
      .then(() => {
        expect(rateNotifier)
          .toHaveBeenCalledWith(token, { json: {} });
      });
  });
});

