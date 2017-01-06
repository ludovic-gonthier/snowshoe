import renderer from 'react-test-renderer';
import React from 'react';

import Logout from '../../../../client/components/buttons/Logout';

describe('Button - Logout', () => {
  it('should render correctly', () => {
    const component = renderer.create(<Logout />);

    expect(component.toJSON()).toMatchSnapshot();
  });
});

