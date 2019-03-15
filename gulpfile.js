'use strict';

var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssnano = require('gulp-cssnano');
var rev = require('gulp-rev');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var modRewrite = require('connect-modrewrite');
var imagemin = require('gulp-imagemin');
var del = require('del');

gulp.task('default', ['sass', 'serve']);
gulp.task('build', ['clean', 'sass', 'compile', 'views', 'fonts', 'images']);

// App server
gulp.task('serve', function () {
  browserSync.init(null, {
    port: 8080,
    server: {
      baseDir: ['app'],
      routes: {
        "/node_modules": "node_modules"
      },
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    }
  });
  gulp.watch('./app/styles/sass/**/*.scss', ['sass']);
  gulp.watch(['./app/**/*.*']).on('change', browserSync.reload);
});

// Dist server
gulp.task('try', function () {
  browserSync.init({
    port: 9000,
    server: {
      baseDir: ['dist'],
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    }
  });
  gulp.watch(['./app/**/*.*']).on('change', browserSync.reload);
});

// Compile sass to css
gulp.task('sass', function () {
  return gulp.src('./app/styles/sass/**/*.scss')
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'expanded'
  }))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('./app/styles'))
  .pipe(browserSync.stream());
});

// Clean "dist" directory
gulp.task('clean', function () {
  return del('./dist');
});

// Compile "index.html", css & js files
gulp.task('compile', function () {
  gulp.src('./app/index.html')
  .pipe(usemin({
    css: [cssnano(), 'concat', rev()],
    html: [htmlmin({collapseWhitespace: true})],
    js: [uglify(), rev()]
  }))
  .pipe(gulp.dest('./dist'))
});

// Copy & minify "views" directory
gulp.task('views', function () {
  gulp.src('./app/views/**/*')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./dist/views'))
});

// Copy "fonts" directory
gulp.task('fonts', function () {
  gulp.src('./app/assets/fonts/**/*')
  .pipe(gulp.dest('./dist/assets/fonts'))
});

// Minify images
gulp.task('images', function () {
  gulp.src('app/assets/images/**/*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
  .pipe(gulp.dest('./dist/assets/images'))
});
