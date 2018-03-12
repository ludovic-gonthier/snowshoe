import * as reducer from 'reducers/history';

import { FILTER_BY_LABELS, CHANGE_ORDER_DIRECTION, CHANGE_ORDER_FIELD } from 'actions';

describe('[Reducers - history]', () => {
  describe('.filters()', () => {
    const action = {
      type: FILTER_BY_LABELS,
    };

    it('should remove field in query when no label', () => {
      const state = {
        labels: [],
      };

      window.history.replaceState({}, 'test', 'http://localhost/?filter=test');

      reducer.filters(state, action);
      expect(window.location.href).toEqual('http://localhost/');
    });

    it('should add field in query when filter present', () => {
      const state = {
        labels: ['test_1', 'test_2'],
      };

      window.history.replaceState({}, 'test', 'http://localhost/?filter=test');

      reducer.filters(state, action);
      expect(window.location.href).toEqual('http://localhost/?filter=test_1&filter=test_2');
    });

    it('should not remove other query field', () => {
      const state = {
        labels: ['test_1', 'test_2'],
      };

      window.history.replaceState({}, 'test', 'http://localhost/?other_field=test');

      reducer.filters(state, action);
      expect(window.location.href).toEqual('http://localhost/?other_field=test&filter=test_1&filter=test_2');
    });
  });
  describe('.order()', () => {
    const state = {
      direction: 'asc',
      field: 'test_field',
    };

    it('should change order field', () => {
      const action = {
        type: CHANGE_ORDER_FIELD,
      };

      window.history.replaceState({}, 'test', 'http://localhost/?order_direction=asc&order_field=another_field');

      reducer.order(state, action);
      expect(window.location.href).toEqual('http://localhost/?order_direction=asc&order_field=test_field');
    });

    it('should change direction field', () => {
      const action = {
        type: CHANGE_ORDER_DIRECTION,
      };

      window.history.replaceState({}, 'test', 'http://localhost/?order_direction=desc&order_field=field');

      reducer.order(state, action);
      expect(window.location.href).toEqual('http://localhost/?order_direction=asc&order_field=field');
    });
  });
});
