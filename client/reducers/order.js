import {
  CHANGE_ORDER_DIRECTION,
  CHANGE_ORDER_FIELD,
} from '../actions';

const initialState = {
  field: 'updated_at',
  direction: 'asc',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ORDER_DIRECTION:
      return Object.assign({}, state, { direction: action.direction });
    case CHANGE_ORDER_FIELD:
      return Object.assign({}, state, { field: action.field });
    default:
      return state;
  }
};
