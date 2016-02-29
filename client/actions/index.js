import * as types from 'constants';

export function receivedDataFromSocket(message, data) {
  return {
    type: types.SOCKET_DATA_RECEIVED,
    data,
    message,
  };
}

export function emitDataToSocket(message, data) {
  return {
    type: types.SOCKET_DATA_EMIT,
    data,
    message,
  };
}
