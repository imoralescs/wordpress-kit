var gulp = require('gulp');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var watchify = require('watchify');

// Sass Task
gulp.task('wordpress:css', function() {
	var gulpSass = require('gulp-sass');
	var bourbon = require('node-bourbon');

  gutil.log('Compiling SCSS...');

	var sassOptions = {
		errLogToConsole: true,
		linefeed: 'lf', // 'lf'/'crlf'/'cr'/'lfcr'
		outputStyle: 'compressed', // 'nested','expanded','compact','compressed'
		sourceComments: false,
		includePaths: bourbon.includePaths
	};

	return gulp.src('./development/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(gulpSass(sassOptions))
		.on("error", notify.onError({
			message: 'Error: <%= error.message %>'
		}))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('./wp-content/themes/theme-name/assets/css'));

});

// Input file.
var bundler = watchify(browserify({entries: './development/js/app.js', extensions: ['.js'], paths: ['./development/js','./development/js/modules'], debug: true}));

// Babel Transform
bundler.transform('babelify', {presets: ['es2015']});

// On update recopile
bundler.on('update', bundle);

function bundle() {

  gutil.log('Compiling JS...');

  return bundler.bundle()
      .on('error', function (err) {
              gutil.log(err.message);
              this.emit("end");
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./wp-content/themes/theme-name/assets/js'));
}

// JS Task
gulp.task('wordpress:js', function () {
  return bundle();
});

gulp.task('default', ['wordpress:css', 'wordpress:js'], function(){
  gulp.watch('./development/sass/**/*.scss', ['wordpress:css']);
	gulp.watch('./development/js/**/*.js', ['wordpress:js']);
});
