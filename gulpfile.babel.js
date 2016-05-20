import del from 'del';
import gulp from 'gulp';
import mocha from 'gulp-mocha';
import util from 'gulp-util';
import webpack from 'webpack';

import { default as webpackConfig } from './webpack.config.babel.js';

const src = [
  '*.js',
  'client/**/(!main.js|*.js)',
  'config/**/*.js',
  'server/**/*.js',
];
const tests = [
  'tests/**/*.js',
];
const files = [].concat(src).concat(tests);

gulp.task('clean', () => {
  del(['build/**']);
});

gulp.task('test', () => {
  process.env.NODE_ENV = 'test';
  gulp.src(tests)
    .pipe(mocha({
      growl: true,
    })).once('end', () => {
      process.exit();
    });
});

gulp.task('build:dev', (end) => {
  const options = Object.assign([], [webpackConfig]);
  let compiled = false;

  options.debug = true;
  options.watch = true;

  return webpack(options, (error, stats) => {
    if (error) {
      throw new util.PluginError('webpack:build', error);
    }

    util.log('[webpack:build]', stats.toString({
      colors: true,
    }));

    if (!compiled) {
      end();
    }

    compiled = true;
  });
});
