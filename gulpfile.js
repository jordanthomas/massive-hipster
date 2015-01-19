var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    imagemin     = require('gulp-imagemin'),
    jade         = require('gulp-jade'),
    jshint       = require('gulp-jshint'),
    del          = require('del'),
    sass         = require('gulp-sass'),
    path         = require('path'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload,
    paths = {
      build: './build',
      scripts: [
        './source/js/**/*.js',
        '!./source/js/vendor/**/*.js'
      ],
      vendor_scripts: [
        './source/js/vendor/**/*.js'
      ],
      pages: [
        './source/**/*.jade',
        '!./source/layouts/**'
      ],
      layouts: [
        './source/layouts/**/*.jade'
      ],
      scss_main: [
        './source/css/main.scss'
      ],
      scss: [
        './source/css/**/*.scss'
      ],
      fonts: [
        './source/fonts/**'
      ],
      images: [
        './source/img/**/*.jpg',
        './source/img/**/*.jpeg',
        './source/img/**/*.png'
      ]
    };

gulp.task('js', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    // .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(path.join(paths.build, 'js')));
});

gulp.task('vendor_js', function() {
  return gulp.src(paths.vendor_scripts, { base: './source/js' })
    .pipe(gulp.dest(path.join(paths.build, 'js')));
});

gulp.task('scss', function () {
  var options = {
    // style: gutil.env.type === 'production' ? 'compressed' : 'expanded',
    style: 'expanded'
  };

  return gulp.src(paths.scss_main)
    .pipe(sass(options))
    .on('error', function() {})
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(path.join(paths.build, 'css')));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(path.join(paths.build, 'fonts')));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(path.join(paths.build, 'img')));
});

gulp.task('html', function() {
  return gulp.src(paths.pages)
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: 'build'
    }
  });

  gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js', 'img/**/*.png'], { cwd: 'build' }, reload);
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['js']);
  gulp.watch(paths.scss, ['scss']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.pages, ['html']);
  gulp.watch(paths.layouts, ['html']);
});

gulp.task('clean', function(cb) {
  del([paths.build], cb);
});

gulp.task('build', ['clean'], function() {
  gulp.start('html', 'scss', 'fonts', 'vendor_js', 'js', 'images');
});

gulp.task('default', ['clean'], function() {
  gulp.start('html', 'scss', 'fonts', 'vendor_js', 'js', 'images', 'server', 'watch');
});
