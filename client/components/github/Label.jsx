import React, { Component, PropTypes } from 'react';

function computeLabelStyle(labelColor) {
  const rgb = labelColor.match(/.{2}/g).map((color) => parseInt(color, 16) / 255);
  const max = Math.max(rgb[0], rgb[1], rgb[2]);
  const min = Math.min(rgb[0], rgb[1], rgb[2]);

  return {
    color: (max + min) / 2 > 0.6 ? 'black' : 'white',
    background: `#${labelColor}`,
  };
}

class Label extends Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.name !== nextProps.name
      || this.props.color !== nextProps.color
      || this.props.disabled !== nextProps.disabled;
  }

  onClick() {
    this.props.filterByLabels(this.props.name);
  }


  render() {
    const { color, disabled, filterable, name } = this.props;
    const attributes = {};

    if (filterable) {
      attributes.onClick = this.onClick;
    }

    if (disabled) {
      attributes.disabled = 'disabled';
    }

    return (
      <div
        style={computeLabelStyle(color)}
        className="github-label text-center ellipsis"
        title={name}
        {...attributes}
      >
        {name}
      </div>
    );
  }
}

Label.propTypes = {
  color: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  filterable: PropTypes.bool,
  filterByLabels: PropTypes.func,
  name: PropTypes.string.isRequired,
};

export default Label;
