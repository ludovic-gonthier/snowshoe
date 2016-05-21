import React, { PropTypes } from 'react';

const defaults = {
  stylesheets: [{
    href: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.4/slate/bootstrap.min.css',
  }],
  scripts: [{
    src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
  }, {
    src: '//netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js',
  }],
  metas: [],
};

export const Layout = (props) => {
  const {
    children,
    metas,
    stylesheets,
    scripts,
    title,
  } = props;

  return (
    <html>
      <head>
        <title>{title}</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {metas.concat(defaults.metas).map((meta, index) => (
          <meta key={index} {...meta} />
        ))}
        {defaults
          .stylesheets
          .concat(stylesheets)
          .map((stylesheet, index) => (
            <link rel="stylesheet" key={index} {...stylesheet} />
        ))}
        {scripts.concat(defaults.scripts)
          .map((script, index) => (
            <script key={index} {...script} />
        ))}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
  metas: PropTypes.arrayOf(PropTypes.object),
  stylesheets: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string.isRequired,
  })),
  scripts: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
  })),
  title: PropTypes.string.isRequired,
};

Layout.defaultProps = {
  stylesheets: [],
  scripts: [],
  metas: [],
  title: 'SnowShoe - Github Dashboards',
};
