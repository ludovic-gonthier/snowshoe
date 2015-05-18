'use strict';

var React = require('react');
var _ = require('lodash');
var io = require('socket.io-client');

var Github = React.createClass({
  getInitialState: function () {
    return {
      pulls: []
    }
  },
  componentDidMount: function () {
    var socket = io();

    socket.emit('user', {
      user: this.props.user,
      accessToken: this.props.accessToken
    });

    if (this.props.repositories_url) {
      socket.emit('pulls', this.props.repositories_url);
    }

    socket.on('pulls', function (pulls) {
      var ids = _.map(this.state.pulls, 'id');

      _.forEach(pulls, function (pull) {
        var index = ids.indexOf(pull.id);

        if (index === -1) {
          this.state.pulls.push(pull);
        } else {
          this.state.pulls[index] = _.assign(this.state.pulls[index], pull);
        }
      }.bind(this));

      this.setState({pulls: _.sortByOrder(this.state.pulls, 'updated_at', [true, false])});
    }.bind(this));

    socket.on('pulls:delete', function (deleted) {
      if (deleted.length) {
        this.setState({pulls: _.filter(this.state.pulls, function (pull) {
          return deleted.indexOf(pull.id) === -1;
        })});
      }
    }.bind(this));

    socket.on('pulls:issues', function (issues) {
      var urls = _.map(this.state.pulls, 'url');

      _.forEach(issues, function (issue) {
        var index = urls.indexOf(issue.pull_request.url);

        if (index !== -1) {
          this.state.pulls[index].labels = issue.labels;
          this.state.pulls[index].comments = issue.comments;
        }
      }.bind(this));

      this.setState({pulls: this.state.pulls});
    }.bind(this));

    socket.on('pulls:status', function (status) {
      var index = _.map(this.state.pulls, 'id').indexOf(status.pull_request.id);

      if (index !== -1) {
        this.state.pulls[index].last_status = status;
      }

      this.setState({pulls: this.state.pulls});
    }.bind(this));
  },
  render: function () {
    return (
      <section className="dashboard clearfix">
        <Github.PullsRequests pulls={this.state.pulls} />
      </section>
    );
  }
});

Github.PullsRequests = React.createClass({
  render: function () {
    return (
      <div className="container-fluid">
        {_.chunk(this.props.pulls, 8).map(function (splice, index) {
          return (
            <div key={index} className="row row-eq-height">
              {splice.map(function (pull, index) {
                return <Github.PullsRequest key={index} pull={pull} />;
              })}
            </div>
          );
        })}
      </div>
    );
  }
});

Github.PullsRequest = React.createClass({
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
          <img className={classes.join(' ')} src={this.props.pull.user.avatar_url} alt={this.props.pull.user.login} width="100" height="100"/>
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

module.exports = Github;
