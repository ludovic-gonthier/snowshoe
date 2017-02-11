import {
  FILTER_BY_LABELS,
} from 'actions';

import reducer from 'reducers/filters';

describe('[Reducer - order]', () => {
  const state = {
    labels: [],
  };

  it('default to initialState when no state given', () => {
    expect(reducer(undefined, { type: '' }))
      .toEqual(state);
  });

  describe(`on ${FILTER_BY_LABELS}`, () => {
    const action = {
      label: 'to_remove',
      type: FILTER_BY_LABELS,
    };
    const updated = reducer({ labels: ['to_remove', 'to_keep'] }, action);

    expect(updated)
      .toEqual({
        labels: ['to_keep'],
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

