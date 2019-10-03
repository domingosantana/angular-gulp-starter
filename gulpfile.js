const gulp = require("gulp"),
browserify = require("browserify"),
modRewrite = require('connect-modrewrite'),
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
    src: 'app/styles/**/*.scss',
    dest: 'dist'
  },
  scripts: {
    src: 'app/js/**/*.js',
    dest: 'dist'
  },
  html: {
    src: 'app/**/*.html',
    dest: 'dist'
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

// Servir directorio "app"
function watch() {
  browserSync.init({
    port: 8080,
    hostname: '0.0.0.0',
    server: {
      baseDir: "./app",
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ],
      routes: {
        "/node_modules": "node_modules"
      }
    }
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
}

// Servir directorio "dist"
function dist() {
  browserSync.init({
    port: 9090,
    server: {
      baseDir: "./app"
    }
  });
}

// Compilar scss a css
function styles() {
  return (
    gulp
    .src(paths.styles.src)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })]))
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest(paths.source))
    .pipe(browserSync.stream())
  );
}

// Concatenar Javascript
function scripts() {
  return browserify({
    entries: 'app/js/app.js',
    path: [paths.scripts.src],
    debug: true,
    transform: [
      babelify.configure({
        presets: ["@babel/preset-env"]
      })
    ]
  })
  .bundle()
  .pipe(source("scripts.min.js"))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(paths.source));
}

// Compilar app

// Compilar scss a css
function stylesBuild() {
  return (
    gulp
    .src(paths.styles.src)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })]))
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest(paths.styles.dest))
  );
}

// Compilar Javascript
function scriptsBuild() {
  return browserify({
    entries: 'app/js/app.js',
    path: [paths.scripts.src],
    debug: true,
    transform: [
      babelify.configure({
        presets: ["@babel/preset-env"]
      })
    ]
  })
  .bundle()
  .pipe(source("scripts.min.js"))
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

// Limpiar directorio "dist"
function cleanup() {
  return del([paths.build]);
}

exports.default = gulp.parallel(styles, scripts, watch);
exports.build = gulp.series(cleanup, gulp.parallel(scriptsBuild, stylesBuild, htmlBuild, fontsBuild, imagesBuild));
exports.dist = dist;
exports.styles = styles;
exports.scripts = scripts;
