import React, { PropTypes } from 'react';

import Dropdown from '../Dropdown';

const OrderByDropdown = ({
  changeOrderDirection,
  changeOrderField,
  disabled,
  order,
}) => (
  <Dropdown title="Order By" disabled={disabled}>
    <li role="presentation" className="dropdown-header">Field</li>
    <li className={order.field === 'created_at' ? 'selected' : ''}>
      <a onClick={() => changeOrderField('created_at')}>Creation time</a>
    </li>
    <li className={order.field === 'updated_at' ? 'selected' : ''}>
      <a onClick={() => changeOrderField('updated_at')}>Update time</a>
    </li>

    <li role="presentation" className="divider" />
    <li role="presentation" className="dropdown-header">Direction</li>
    <li className={order.direction === 'asc' ? 'selected' : ''}>
      <a onClick={() => changeOrderDirection('asc')}>Older first</a>
    </li>
    <li className={order.direction === 'desc' ? 'selected' : ''}>
      <a onClick={() => changeOrderDirection('desc')}>Newer first</a>
    </li>
  </Dropdown>
);

OrderByDropdown.propTypes = {
  changeOrderDirection: PropTypes.func.isRequired,
  changeOrderField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  order: PropTypes.shape({
    direction: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }),
};

export default OrderByDropdown;
