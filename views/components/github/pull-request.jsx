'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function () {
    var classes = ['img-circle'];
    if (this.props.pull.last_status) {
      classes.push(this.props.pull.last_status.state);
    }

    return (
        <div className="thumbnail">
          <header className="caption text-center"><strong>{this.props.pull.base.repo.name}</strong></header>
            <span className="badge">
              <span className="glyphicon glyphicon-comment"></span>
              <span className="github-commemts-number">{this.props.pull.comments || 0}</span>
            </span>
          <img className={classes.join(' ')} src={this.props.pull.user.avatar_url} title={this.props.pull.user.login} alt={this.props.pull.user.login} width="100" height="100"/>

          <div className="text-center github-title">{ this.props.pull.isTitleDisplayed ? this.props.pull.title : '' }</div>
          <div className="caption text-center github-request-number"><a href={this.props.pull.html_url} target="_blank">#{this.props.pull.number}</a></div>
          {!this.props.pull.labels ? '' :
            this.props.pull.labels.map(function (label, index) {
              var rgb = label.color.match(/.{2}/g).map(function (color) {
                return parseInt(color, 16) / 255;
              });
              var style = {
                color: (Math.max(rgb[0], rgb[1], rgb[2]) + Math.min(rgb[0], rgb[1], rgb[2])) / 2 > 0.6 ? 'black' : 'white',
                background: '#' + label.color
              };

              return (
                <div key={index} style={style} className="github-label text-center">{label.name}</div>
              );
            })

          }
        </div>
    );
  }
});
