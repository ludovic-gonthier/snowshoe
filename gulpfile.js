'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gls = require('gulp-live-server');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

gulp.task('lint', function () {
  return gulp.src([
      '*.js',
      'controllers/**/*.js',
      'lib/**/*.js',
      'views/**/*.jsx'
    ])
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError());
});
gulp.task('lint:watch', function () {
  return gulp.watch([
      '*.js',
      'controllers/**/*.js',
      'lib/**/*.js',
      'views/**/*.jsx'
    ])
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError());
});

gulp.task('reactify', function () {
  var start = Date.now();

  gulp.src(['views/bridges/**.js'])
    // .pipe(uglify())
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

  // gulp.watch('views/{components,bridges}/**.{js,jsx}', ['reactify']);s
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

  gulp.watch([
    '{app,server}.js',
    '{lib,controllers}/**.js',
    'views/{components,pages}/**.jsx'
  ], server.start);
});

gulp.task('default', ['reactify', 'server', 'server:watch']);
