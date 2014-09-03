/* jshint node:true */
'use strict';

var bowerDist = require('gulp-bower-dist');
var bump = require('gulp-bump');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var ghpages = require('gulp-gh-pages');
var gulp = require('gulp');
var helptext = require('gulp-helptext');
var jshint = require('gulp-jshint');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var rm = require('gulp-rm');
var stylus = require('gulp-stylus');
var vulcanize = require('gulp-vulcanize');

var paths = {
  'main': 'src/brick-flipbox.html',
  'scripts': 'src/*.js',
  'stylesheets': 'src/*.styl',
  'themes': 'src/themes/**/*.styl',
  'src': 'src/**/*',
  'dist': 'dist/**/*',
  'index': 'index.html',
  'bowerComponents': 'bower_components/**/*',
};

gulp.task('lint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
  return gulp.src(paths.stylesheets)
    .pipe(stylus())
    .pipe(concat('brick-flipbox.css'))
    .pipe(prefix("last 2 versions", "Firefox >= 18", "ie >= 10"))
    .pipe(gulp.dest('src'));
});

gulp.task('themes', function() {
  return gulp.src(paths.themes)
    .pipe(stylus())
    .pipe(prefix("last 2 versions", "Firefox >= 18", "ie >= 10"))
    .pipe(gulp.dest('src/themes'));
});

gulp.task('rename', ['vulcanize'], function() {
  return gulp.src('dist/brick-flipbox.html')
    .pipe(rename(function(path){
      path.basename += '.local';
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', ['vulcanize', 'rename'], function() {
  gulp.src(['src/*.css', 'src/themes/**/*.css'])
    .pipe(rm());
});

gulp.task('vulcanize', ['styles','themes'], function() {
  return gulp.src('src/brick-flipbox.html')
    .pipe(vulcanize({
      excludes: {
        imports: ['bower_components'],
        scripts: ['bower_components'],
        styles: ['bower_components']
      },
      dest: 'dist',
      csp: true,
      inline: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['vulcanize'], function () {
  return gulp.src('dist/*.local.html')
    .pipe(bowerDist())
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('.local', '');
    }))
    .pipe(gulp.dest('dist'));
});

// build scripts and styles
gulp.task('build', ['lint','styles','themes','vulcanize', 'rename','dist','clean']);

gulp.task('connect', function() {
  connect.server({
    port: 3001
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.src, ['build']);
});

// do a build, start a server, watch for changes
gulp.task('server', ['build','connect','watch']);

// Bump up the Version (patch)
gulp.task('bump', function(){
  gulp.src(['bower.json','package.json'])
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('help', helptext({
  'default': 'Shows the help message',
  'help': 'This help message',
  'styles': 'Compiles main stylus',
  'themes': 'Compiles themes stylus',
  'vulcanize': 'Vulcanizes to component html file',
  'lint': 'Runs JSHint on your code',
  'server': 'Starts the development server',
  'bump': 'Bumps up the Version',
  'deploy': 'Publish to Github pages'
}));

// publish to gh pages
gulp.task('deploy', function () {
  gulp.src([
    paths.index,
    paths.dist,
    paths.bowerComponents
  ],{base:'./'})
    .pipe(ghpages());
});

gulp.task('default', ['help']);
