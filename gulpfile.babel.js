import gulp from 'gulp';
import mocha from 'gulp-mocha';

const tests = [
  'tests/**/*.js',
];

gulp.task('test', () => {
  process.env.NODE_ENV = 'test';
  gulp.src(tests)
    .pipe(mocha({
      growl: true,
    })).once('end', () => {
      process.exit();
    });
});
