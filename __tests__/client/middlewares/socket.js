import io from 'socket.io-client';
import { receivedDataFromSocket, SOCKET_DATA_EMIT } from '../../../client/actions';

import { listen, middleware } from '../../../client/middlewares/socket';

jest.mock('socket.io-client');
jest.mock('../../../client/actions', () => ({
  SOCKET_DATA_EMIT: 'SOCKET_DATA_EMIT',
  receivedDataFromSocket: jest.fn(),
}));

describe('clients middlewares - socket', () => {
  const socket = {
    on: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();

    // We mock the socket singleton
    io.mockImplementationOnce(() => socket);
  });

  describe('middleware', () => {
    it('should not emit the message if socket not created', () => {
      const next = jest.fn();
      const action = {
        data: {},
        message: 'the_message',
        type: SOCKET_DATA_EMIT,
      };

      middleware()(next)(action);

      expect(next)
        .toHaveBeenCalledWith(action);
    });
  });

  describe('listen', () => {
    it('should listen on disconnect events', () => {
      const store = {
        dispatch: jest.fn(),
      };

      listen(store);

      expect(socket.on)
        .toHaveBeenCalledWith('disconnect', expect.any(Function));
    });

    it('should dipatch disconnect events', () => {
      const data = {};

      // Emule a disconnect message
      socket.on
        .mockImplementationOnce((event, cb) => {
          if (event === 'disconnect') {
            cb(data);
          }
        });
      receivedDataFromSocket
        .mockImplementationOnce(() => data);

      const store = {
        dispatch: jest.fn(),
      };

      listen(store);

      expect(receivedDataFromSocket)
        .toHaveBeenCalledWith('disconnect', data);
      expect(store.dispatch)
        .toHaveBeenCalledWith(data);
    });

    it('should listen on action', () => {
      const store = {
        dispatch: jest.fn(),
      };

      listen(store);

      expect(socket.on)
        .toHaveBeenCalledWith('action', store.dispatch);
    });

    describe('middleware', () => {
      it('should emit the message', () => {
        const next = jest.fn();
        const action = {
          data: {},
          message: 'the_message',
          type: SOCKET_DATA_EMIT,
        };

        middleware()(next)(action);

        expect(socket.emit)
          .toHaveBeenCalledWith(action.message, action.data);
      });
    });
  });
});
