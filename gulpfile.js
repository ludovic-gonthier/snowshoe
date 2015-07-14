'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gls = require('gulp-live-server');
var jslint = require('gulp-jslint');
var uglify = require('gulp-uglify');

gulp.task('lint', function () {
  var files = [
    '*.js',
    'views/bridges/**.js'
  ];

  return gulp.src(files)
    .pipe(jslint({
      "es6": true,
      "strict": true,
      "node": true,

      "indent": 2,
      "trailing": true,
      "white": false,
      "maxerr": 50,

      "debug": false,
      "devel": false,

      "newcap": true,
      "noempty": true,
      "nomen": true,
      "unparam": true
    }))
    .on('error', function (error) {
      console.error(String(error));
    });
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
      console.log('Complete!', (Date.now() - start) / 1000 + 's');
    });

  // gulp.watch('views/{components,bridges}/**.{js,jsx}', ['reactify']);s
});

gulp.task('server', function () {
  var server = gls.new('app.js');

  server.start();

  gulp.watch([
    'app.js',
    '{lib,config,controllers}/**.js',
    'views{components,pages}/**.jsx'
  ], server.start);
});

gulp.task('server-prod', function () {
  var server = gls('app.js', {env: {NODE_ENV: "production"}});

  server.start();
});

gulp.task('default', ['reactify', 'server']);
