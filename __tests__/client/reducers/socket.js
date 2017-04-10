import reducer from 'reducers/socket';
import { SOCKET_DATA_RECEIVED } from 'actions';

describe('[Reducer - socket]', () => {
  const state = { connected: true };

  it('default to initialState when no state given', () => {
    expect(reducer(undefined, { action: '' }))
      .toEqual({ connected: true });
  });

  describe(`on ${SOCKET_DATA_RECEIVED}`, () => {
    it('when message is disconnect, notify disconnection', () => {
      const action = {
        type: SOCKET_DATA_RECEIVED,
        message: 'disconnect',
      };
      const updated = reducer(state, action);

      expect(updated !== state).toBe(true);
      expect(updated).toEqual({ connected: false });
    });

    it('when message is anything else, return current state', () => {
      const action = {
        type: SOCKET_DATA_RECEIVED,
        message: 'other_message',
      };
      const updated = reducer(state, action);

      expect(updated === state).toBe(true);
    });
  });

  describe('on other actions', () => {
    it('return current state', () => {
      const action = { type: 'unknown_action' };
      const updated = reducer(state, action);

      expect(updated === state).toBe(true);
    });
  });
});
