// http://spraso.com/real-time-data-flow-with-redux-and-socket-io/
import io from 'socket.io-client';
import * as actions from '../actions';

let socket;

export function middleware() {
  return next => (action) => {
    if (socket && action.type === actions.SOCKET_DATA_EMIT) {
      socket.emit(action.message, action.data);
    }

    return next(action);
  };
}

export function listen(store) {
  socket = io();

  const events = [
    'disconnect',
  ];

  events.forEach(event => socket.on(event, data =>
    store.dispatch(actions.receivedDataFromSocket(event, data)),
  ));

  socket.on('action', store.dispatch);
}
