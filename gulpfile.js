'use strict';

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var eslint = require('gulp-eslint');
var gls = require('gulp-live-server');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var gulp = require('gulp');
var uglify = require('gulp-uglify');

var files = [
  '{app,server}.js',
  '{lib,controllers}/*.js',
  '{lib,controllers}/**/*.js',
  'views/{components,pages}/*.jsx',
  'views/{components,pages}/**/*.jsx'
];

gulp.task('clean', function () {
  return gulp.src([
    'cache/',
    'public/views/'
    ], {read: false})
    .pipe(clean());
});

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

gulp.task('test', function () {
  gulp.src(['lib/**/*.js', 'app.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src('tests/**/*.js')
        .pipe(mocha({
          growl: true
        }))
        .pipe(istanbul.writeReports({
          dir: './assets/unit-test-coverage',
          reporters: [ 'lcov', 'text', 'text-summary' ],
          reportOpts: { lcov: {
            dir: './assets/unit-test-coverage'
          }}
        }));
    });
});

gulp.task('default', [
  'clean',
  'reactify',
  'server'
]);
