var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssnano = require('gulp-cssnano');
var rev = require('gulp-rev');
var browserSync = require('browser-sync').create();
var modRewrite = require('connect-modrewrite');
var imagemin = require('gulp-imagemin');

// Serve "src" directory
function serve() {
  browserSync.init(null, {
    port: 8080,
    server: {
      baseDir: ['src'],
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
  gulp.watch('./src/styles/sass/**/*.scss', sass);
  gulp.watch(['./src/**/*.*']).on('change', browserSync.reload);
}

// Serve "dist" directory
function test() {
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
  gulp.watch(['./src/**/*.*']).on('change', browserSync.reload);
}

// Compile sass to css
function sass() {
  return gulp
  .src('./src/styles/sass/**/*.scss')
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'expanded'
  }))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(dest('./src/styles'))
  .pipe(browserSync.stream());
}

// Clean "dist" directory
function clean() {
  return del('./dist');
}

// Compile "index.html", css & js files
function compile() {
  return gulp
  .src('./src/index.html')
  .pipe(usemin({
    css: [cssnano(), 'concat', rev()],
    html: [htmlmin({collapseWhitespace: true})],
    js: [uglify(), rev()]
  }))
  .pipe(dest('./dist'))
}

// Copy & minify "views" directory
function views() {
  return gulp
  .src('./src/views/**/*')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(dest('./dist/views'))
}

// Copy "fonts" directory
function fonts() {
  return gulp
  .src('./src/assets/fonts/**/*')
  .pipe(dest('./dist/assets/fonts'))
}

// Minify images
function images() {
  return gulp
  .src('src/assets/images/**/*')
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
  .pipe(dest('./dist/assets/images'))
}

// Define complex tasks
const build = gulp.series(clean, sass, compile, views, fonts, images);

// Expose tasks to CLI
exports.default = serve;
exports.serve = serve;
exports.test = test;
exports.sass = sass;
exports.clean = clean;
exports.compile = compile;
exports.views = views;
exports.fonts = fonts;
exports.images = images;
exports.build = build;
