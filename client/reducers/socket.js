import {
  SOCKET_DATA_RECEIVED,
} from '../actions';

const initialState = {
  connected: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SOCKET_DATA_RECEIVED:
      if (action.message === 'disconnect') {
        return { connected: false };
      }

      return state;
    default:
      return state;
  }
};
