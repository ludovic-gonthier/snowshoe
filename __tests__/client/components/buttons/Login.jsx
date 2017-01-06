import renderer from 'react-test-renderer';
import React from 'react';

import Login from '../../../../client/components/buttons/Login';

describe('Button - Login', () => {
  it('should render correctly', () => {
    const component = renderer.create(<Login />);

    expect(component.toJSON()).toMatchSnapshot();
  });
});
