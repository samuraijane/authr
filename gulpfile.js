let annotate = require('gulp-ng-annotate'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function() {
  return gulp.src(['./src/js/main.js', './src/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(annotate())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public'))
    .pipe(livereload());
});

gulp.task('sass', function () {
  return gulp.src('./src/css/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public'))
    .pipe(livereload());
});

gulp.task('html', function() {
  return gulp.src(['public/index.html'])
  .pipe(livereload());
});

gulp.task('build', function() {
  livereload.listen();
  gulp.watch('public/*.html', ['html']);
  gulp.watch('src/js/**/*.html', ['html']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/css/*.scss', ['sass']);
});

gulp.task('watch', ['build'], function() {
  return nodemon({
    script: 'server.js'
  });
});
