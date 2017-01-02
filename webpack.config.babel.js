import webpack from 'webpack';

import config from './config';

const webpackConfig = {
  devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'source-map',
  entry: {
    main: `${config.get('webpack.client.entry')}/main.jsx`,
    login: `${config.get('webpack.client.entry')}/login.jsx`,
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3|\.ogg$/,
        loader: 'file',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules',
      },
    ],
  },
  output: {
    path: config.get('webpack.client.output'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
    }),
  ],
  resolve: {
    root: config.get('root'),
    extensions: ['', '.js', '.jsx'],
    alias: [
      'actions',
      'components',
      'constants',
      'containers',
      'reducers',
      'stores',
      'views',
    ],
    modulesDirectories: ['node_modules', 'client'],
  },
  target: 'web',
};

export default webpackConfig;
