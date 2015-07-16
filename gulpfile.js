'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gls = require('gulp-live-server');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

var files = [
  '{app,server}.js',
  '{lib,controllers}/**.js',
  'views/{components,pages}/**.jsx'
];

gulp.task('lint', function () {
  return gulp.src(files)
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError());
});
gulp.task('lint:watch', function () {
  return gulp.watch(files)
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError());
});

gulp.task('reactify', function () {
  var start = Date.now();

  gulp.src(['views/bridges/**.js'])
    .pipe(uglify())
    .pipe(browserify({
      transform: [ 'reactify' ]
    }))
    .pipe(gulp.dest('public/views'))
    .on('end', function () {
      console.log( // eslint-disable-line no-console
        'reactify: complete after %s!',
        (Date.now() - start) / 1000 + 's'
      );
    });
});

gulp.task('server', function () {
  var server = gls('app.js', {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  });

  server.start();
});
gulp.task('server:watch', function () {
  var server = gls('app.js', {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  });

  server.start();

  gulp.watch(files, function () {
    server.start();
  });
});

gulp.task('default', [
  'reactify',
  'server'
]);
