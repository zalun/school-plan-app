/* jshint node:true */
'use strict';

var bowerDist = require('gulp-bower-dist');
var bump = require('gulp-bump');
var connect = require('gulp-connect');
var ghpages = require('gulp-gh-pages');
var gulp = require('gulp');
var helptext = require('gulp-helptext');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var vulcanize = require('gulp-vulcanize');

var paths = {
  'main': 'src/brick-action.html',
  'scripts': 'src/*.js',
  'src': 'src/*',
  'dist': 'dist/**/*',
  'index': 'index.html',
  'bowerComponents': 'bower_components/**/*',
};

gulp.task('lint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('rename', ['vulcanize'], function() {
  return gulp.src('dist/brick-action.html')
    .pipe(rename(function(path){
      path.basename += '.local';
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('vulcanize', function() {
  return gulp.src('src/brick-action.html')
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

gulp.task('build', ['lint','vulcanize', 'rename','dist']);

gulp.task('connect', function() {
  connect.server({
    port: 3001
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['lint']);
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
