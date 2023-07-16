const { src, dest, series, parallel, watch } = require('gulp');
const sass          = require('gulp-sass')(require('sass'));
const pug           = require('gulp-pug');
const clean         = require('gulp-clean');
const sourcemaps    = require('gulp-sourcemaps');
const autoprefixer  = require('gulp-autoprefixer');
const rename        = require('gulp-rename');
const concat        = require('gulp-concat');
const babel         = require('gulp-babel');
const uglify        = require('gulp-uglify-es').default;
const appendPrepend = require('gulp-append-prepend');
const browserSync   = require('browser-sync').create();
const avif          = require('gulp-avif');
const webp          = require('gulp-webp');
const imagemin      = require('gulp-imagemin');
const newer         = require('gulp-newer');
const fonter        = require('gulp-fonter');
const ttf2woff2     = require('gulp-ttf2woff2');
const svgSprite     = require('gulp-svg-sprite');
const plumber       = require('gulp-plumber');


function startBrowser() {
  browserSync.init({
    server: {
        baseDir: "./src"
    }
  });
}

function watching() {
  watch('./src/**/*.pug').on('change', pugToHtml);
  watch('./src/*.pug', pugToHtml);
  watch('./src/scss/**/*.scss', scssToCss);
  watch('./src/js/**/*.js').on('change', browserSync.reload);

  // watch('./src/images/src', images);
}

function scssToCss() {
  return src('./src/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(rename('style.min.css'))
      .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/css'))
    .pipe(browserSync.stream());
}

function pugToHtml() {
  return src('./src/*.pug')
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(dest('./src'))
    .pipe(browserSync.stream());
}

function clearDist() {
  return src('dist', { allowEmpty: true })
    .pipe(clean());
}

function moveFiles() {
  return src([
    './src/*.html',
    './src/js/main.js',
    './src/images/*.*',
    '!./src/images/stack',
    // '!./src/images/*.svg', './src/images/sprite.svg',
    './src/fonts/*.*',
  ], { base: 'src' })
    .pipe(dest('./dist'));
}

function prefixCss() {
  return src('./src/css/style.min.css')
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] }))
    .pipe(dest('./dist/css'));
}

function babelifyJs() {
  return src('./dist/js/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename('babelify.js'))
    .pipe(uglify())
    .pipe(dest('./dist/js'));
}

function uniteJs() {
  return src('./src/js/libs/**/*.js')
    .pipe(concat('main.js'))
    .pipe(appendPrepend.appendText('// Main code'))
    .pipe(appendPrepend.appendFile('./dist/js/babelify.js'))
    .pipe(dest('./dist/js'));
}

function images() {
  return src(['./src/images/src/*.*', '!./src/images/src/*.svg'])
    .pipe(newer('./src/images'))
    .pipe(avif({ quality: 50 }))

    .pipe(src('./src/images/src/*.*'))
    .pipe(newer('./src/images'))
    .pipe(webp())

    .pipe(src('./src/images/src/*.*'))
    .pipe(newer('./src/images'))
    .pipe(imagemin())

    .pipe(dest('./src/images'));
}

function sprite() {
  return src('./src/images/*.svg')
    .pipe(svgSprite({
      mode: {        
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest('./src/images'))
}

function fonts() {
  return src('./src/fonts/*.*')
    .pipe(fonter({
      formats: ['woff', 'ttf']
    }))
    .pipe(src('./src/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('./src/fonts'));
}


module.exports.scss = scssToCss;
module.exports.pug = pugToHtml;
module.exports.watch = watching;
module.exports.build = series(clearDist, prefixCss, moveFiles, babelifyJs, uniteJs);
module.exports.dev = parallel(scssToCss, pugToHtml, startBrowser, watching);

// Картинки
module.exports.images = images;
module.exports.sprite = sprite;

// Шрифты
module.exports.fonts = fonts;
