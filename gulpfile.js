const { src, dest, watch, series, parallel } = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const browserSync = require('browser-sync');
const modRewrite = require('connect-modrewrite');
const imagemin = require('gulp-imagemin');

// App server
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
  gulp.watch('./src/styles/sass/**/*.scss', ['sass']);
  gulp.watch(['./src/**/*.*']).on('change', browserSync.reload);
}

// Dist server
function try() {
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
  return gulp.src('./src/styles/sass/**/*.scss')
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'expanded'
  }))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('./src/styles'))
  .pipe(browserSync.stream());
}

// Clean "dist" directory
function clean() {
  return del('./dist');
}

// Compile "index.html", css & js files
function compile() {
  gulp.src('./src/index.html')
  .pipe(usemin({
    css: [cssnano(), 'concat', rev()],
    html: [htmlmin({collapseWhitespace: true})],
    js: [uglify(), rev()]
  }))
  .pipe(gulp.dest('./dist'))
}

// Copy & minify "views" directory
function views() {
  gulp.src('./src/views/**/*')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./dist/views'))
}

// Copy "fonts" directory
function fonts() {
  gulp.src('./src/assets/fonts/**/*')
  .pipe(gulp.dest('./dist/assets/fonts'))
}

// Minify images
function images() {
  gulp.src('src/assets/images/**/*')
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
}

// Define complex tasks
const serve = gulp.series(sass, serve);
const build = gulp.series(clean, sass, compile, views, fonts, images);

// Expose tasks to CLI
exports.clean = clean;
exports.sass = sass;
exports.compile = compile;
exports.views = views;
exports.fonts = fonts;
exports.images = images;
exports.default = serve;
exports.build = build;
