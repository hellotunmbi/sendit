const gulp = require("gulp");
const connect = require("gulp-connect");
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babel-core');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');

gulp.task("reload", function() {
  return gulp.src("./index.html").pipe(connect.reload());
});

// gulp.task("watchfiles", function() {
//   gulp.watch(["./index.html", "admin/*", "user/*", "css/*.css", "js/*.js"], ["reload"]);
// });

// gulp.task("default", ["server", "watch"]);


gulp.task('build', function () {
  // main.js is your main JS file with all your module inclusions
  return browserify({ entries: './src/js/main.js', debug: true })
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload())
});

gulp.task('watch', ['build'], function () {
  gulp.watch(["./index.html", "admin/*", "user/*", "css/*.css", "src/js/*.js"], ['build', 'reload']);
});

gulp.task("server", function() {
  return connect.server({
    port: 8080,
    livereload: true
  });
});

gulp.task('default', ['watch', 'server']);