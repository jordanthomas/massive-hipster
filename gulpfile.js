var ecstatic    = require('ecstatic'),
    http        = require('http'),
    path        = require('path'),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    concat      = require('gulp-concat'),
    jshint      = require('gulp-jshint'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    sass        = require('gulp-sass'),
    imagemin    = require('gulp-imagemin'),
    clean       = require('gulp-clean'),
    paths = {
      build:     'build',
      scripts:   ['source/js/**/*.js', '!source/js/vendor/**/*.js'],
      pages:     ['source/**/*.jade', '!source/layouts/**'],
      layouts:   ['source/layouts/**/*.jade'],
      scss_main: ['source/css/main.scss'],
      scss:      ['source/css/**/*.scss'],
      fonts:     ['source/css/fonts/**'],
      images:    ['source/img/**/*.jpg', 'source/img/**/*.jpeg', 'source/img/**/*.png']
    };

gulp.task('uglify', function() {
  return gulp.src(paths.scripts)
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(path.join(paths.build, 'js')));
});

gulp.task('jslint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('scss', function () {
  return gulp.src(paths.scss_main)
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest(path.join(paths.build, 'css')));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(path.join(paths.build, 'css', 'fonts')));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(path.join(paths.build, '/img')));
});

gulp.task('html', function() {
  return gulp.src(paths.pages)
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('server', function() {
  http.createServer(
    ecstatic({ root: path.join(__dirname, paths.build) })
  ).listen(8080);

  console.log('Server listening on 8080...');
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['jslint', 'uglify']);
  gulp.watch(paths.scss, ['scss']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.pages, ['html']);
  gulp.watch(paths.layouts, ['html']);
});

gulp.task('clean', function() {
  return gulp.src(paths.build, { read: false })
    .pipe(clean());
});

gulp.task('build', ['html', 'scss', 'fonts', 'uglify', 'images']);

gulp.task('default', ['server', 'html', 'scss', 'fonts', 'jslint', 'uglify', 'images', 'watch']);
