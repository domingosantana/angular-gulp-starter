const gulp = require("gulp"),
browserify = require("browserify"),
babelify = require("babelify"),
source = require("vinyl-source-stream"),
buffer = require("vinyl-buffer"),
uglify = require("gulp-uglify"),
htmlmin = require("gulp-htmlmin"),
postcss = require("gulp-postcss"),
cssnano = require("cssnano"),
del = require("del"),
sass = require('gulp-sass'),
autoprefixer = require("autoprefixer"),
rename = require("gulp-rename"),
imagemin = require('gulp-imagemin'),
browserSync = require("browser-sync").create();

const paths = {
  source: "app",
  build: "dist",
  styles: {
    scss: 'app/styles/scss/**/*.scss',
    css: 'app/styles/*.css',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'app/scripts/**/*.js',
    dest: 'dist/scripts/'
  },
  html: {
    src: 'app/**/*.html',
    dest: 'dist/'
  },
  fonts: {
    src: 'app/fonts/**/*',
    dest: 'dist/fonts'
  },
  images: {
    src: 'app/images/**/*',
    dest: 'dist/images'
  }
};

// Compilar scss a css
function styles() {
  return (
    gulp
    .src(paths.styles.scss)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })]))
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.stream())
  );
}

// Servir directorio "src"
function watch() {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: "./app",
      routes: {
        "/node_modules": "node_modules"
      }
    }
  });
  gulp.watch(paths.styles.scss, styles);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
}

// Servir directorio "dist"
function test() {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: "./app"
    }
  });
}

// Limpiar directorio "dist"
function cleanup() {
  return del([paths.build]);
}

// Compilar css
function cssBuild() {
  return gulp
  .src(paths.styles.css)
  .pipe(postcss([cssnano()]))
  .pipe(rename('styles.css'))
  .pipe(gulp.dest(paths.styles.dest));
}

// Compilar Javascript
function javascriptBuild() {
  return browserify({
    path: [paths.scripts.src],
    debug: true,
    transform: [
      babelify.configure({
        presets: ["@babel/preset-env"]
      })
    ]
  })
  .bundle()
  .pipe(source("scripts.js"))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(paths.scripts.dest));
}

// Compilar html
function htmlBuild() {
  return gulp
  .src(paths.html.src)
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest(paths.html.dest));
}

// Copiar directorio "fonts"
function fontsBuild() {
  return gulp
  .src(paths.fonts.src)
  .pipe(gulp.dest(paths.fonts.dest));
}

// Minificar imágenes
function imagesBuild() {
  return gulp
  .src(paths.images.src)
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
  .pipe(gulp.dest(paths.images.dest));
}

exports.default = gulp.parallel(styles, watch);
exports.build = gulp.series(cleanup, gulp.parallel(javascriptBuild, cssBuild, htmlBuild, fontsBuild, imagesBuild));
exports.test = test;
