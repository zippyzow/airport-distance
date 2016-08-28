//gulp process to concat all html, css, and js files on save 

//gulp packages
var gulp  = require('gulp'),
    jshint = require('gulp-jshint'),
    sass   = require('gulp-sass'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    templateCache = require('gulp-angular-templatecache');

var jsComponents = 'src/**/*.js',
    jsSrc = [jsComponents],
    jsVendor = [
      'node_modules/angular/angular.js',
      'node_modules/angular-material/angular-material.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-animate/angular-animate.js'
    ],
    jsAll = jsVendor.concat(['src/app.js', 'src/**/*.js']);

var scssComponents = 'src/**/*.scss',
    scssSrc = [scssComponents];

var htmlSrc = 'src/**/*.html';

var buildPath = 'public/build';

gulp.task('default', ['jshint', 'concat-js', 'build-and-concat-css', 'build-html', 'watch']);

gulp.task('concat-js', function() {
  return gulp.src(jsAll)
      .pipe(concat('concated.js'))
      .pipe(gulp.dest(buildPath));
});

gulp.task('jshint', function() {
  return gulp.src(jsSrc)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-html', function () {
  return gulp.src(htmlSrc)
      .pipe(templateCache())
      .pipe(gulp.dest(buildPath));
});

gulp.task('build-src-css', function() {
  return gulp.src(scssComponents)
      .pipe(sass())
      .pipe(gulp.dest('intermediate/stylesheets/src'));
});

gulp.task('build-and-concat-css', ['build-src-css'], function() {
  return gulp.src('intermediate/**/*.css')
      .pipe(concat('bundle.css'))
      .pipe(gulp.dest(buildPath));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch(jsSrc, ['jshint', 'concat-js']);
  gulp.watch(htmlSrc, ['build-html']);
  gulp.watch(scssSrc, ['build-and-concat-css']);
});

