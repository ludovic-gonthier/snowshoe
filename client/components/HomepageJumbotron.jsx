import React from 'react';

export const HomepageJumbotron = () => {
  const classes = [
    'jumbotron',
    'homepage-jumbotron',
    'col-lg-8',
    'col-md-10',
    'col-lg-offset-2',
    'col-md-offset-1',
  ].join(' ');
  return (
    <div className={classes}>
      <h2>Welcome to <strong>SnowShoe</strong> Dashboards</h2>
      <p className="lead">
        You can now starts to watch your ongoing Pull-Requests. You can choose to:
      </p>
      <div className="token col-lg-6 col-md-6 pull-left">
        <div className="panel-body clearfix">
          <h3>Access your Pull-Request</h3>
          <ul>
            <li>Click on your Github name in the menu bar</li>
            <li>Select the Pull-Requests your want to display</li>
          </ul>
        </div>
      </div>
      <div className="github col-lg-6 col-md-6 pull-right">
        <div className="panel-body clearfix">
          <h3 className="pull-left">Access an Organisation Pull-Requests</h3>
          <ul className="pull-left">
            <li>Select your Organisation in the menu bar</li>
            <li>Wait for the Teams to be loaded</li>
            <li>Select the team for which you want to display the Pull-Requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
