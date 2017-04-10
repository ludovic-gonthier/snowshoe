import {
  CHANGE_ORDER_DIRECTION,
  CHANGE_ORDER_FIELD,
} from 'actions';

import reducer from 'reducers/order';

describe('[Reducer - order]', () => {
  const state = {
    field: 'updated_at',
    direction: 'asc',
  };

  it('default to initialState when no state given', () => {
    expect(reducer(undefined, { type: '' }))
      .toEqual(state);
  });

  describe(`on ${CHANGE_ORDER_DIRECTION}`, () => {
    it('change order direction', () => {
      const action = {
        type: CHANGE_ORDER_DIRECTION,
        direction: 'desc',
      };
      const updated = reducer(state, action);

      expect(updated)
        .toEqual({
          field: 'updated_at',
          direction: 'desc',
        });
    });
  });

  describe(`on ${CHANGE_ORDER_FIELD}`, () => {
    it('change order field', () => {
      const action = {
        type: CHANGE_ORDER_FIELD,
        field: 'created_at',
      };
      const updated = reducer(state, action);

      expect(updated)
        .toEqual({
          field: 'created_at',
          direction: 'asc',
        });
    });
  });

  describe('on other actions', () => {
    it('return the current state', () => {
      const updated = reducer(state, { type: '' });
      expect(updated === state)
        .toBe(true);
    });
  });
});
