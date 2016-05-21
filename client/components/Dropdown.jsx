import React, { Component, PropTypes } from 'react';

export class Dropdown extends Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.state = {
      open: false,
    };
  }

  onClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const classes = ['dropdown'];
    const attributes = {};

    if (this.props.disabled) {
      attributes.disabled = 'disabled';
    }

    if (this.state.open) {
      classes.push('open');
    }

    return (
      <li ref="dropdown" className={classes.join(' ')}>
        <a
          className="btn dropdown-toggle"
          onClick={this.onClick}
          {...attributes}
        >
          {this.props.title}
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
        {this.props.children}
        </ul>
      </li>
    );
  }
}

Dropdown.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};
