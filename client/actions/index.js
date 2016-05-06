export const SOCKET_DATA_RECEIVED = 'SOCKET_DATA_RECEIVED';
export const SOCKET_DATA_EMIT = 'SOCKET_DATA_EMIT';

export function receivedDataFromSocket(message, data) {
  return {
    type: SOCKET_DATA_RECEIVED,
    data,
    message,
  };
}

export function emitDataToSocket(message, data) {
  return {
    type: SOCKET_DATA_EMIT,
    data,
    message,
  };
}
