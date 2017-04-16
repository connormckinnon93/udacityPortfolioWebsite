var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['copy-html', 'copy-images', 'scripts', 'serve'], function() {
});

gulp.task('serve', ['copy-html', 'styles', 'lint'], function() {

	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});

	gulp.watch('sass/**/*.scss',['styles']);
	gulp.watch('js/**/*.js',['lint', 'scripts']);
	gulp.watch('./*.html',['copy-html']);
	gulp.watch('./dist/js/main.js').on('change', browserSync.reload);
	gulp.watch('./dist/*.html').on('change', browserSync.reload);
});

gulp.task('copy-html', function() {
	gulp.src('./*.html')
	    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('img/*')
	    .pipe(gulp.dest('dist/img'));
});

gulp.task('scripts', function() {
	gulp.src('js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
	    .pipe(gulp.dest('dist/js'));
});

gulp.task('lint', () => {
    return gulp.src(['js/**/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sourcemaps.init())
	    .pipe(sass({
	    	outputStyle: 'compressed'	
	    }).on('error', sass.logError))
	    .pipe(autoprefixer({
	    	browsers: ['last 2 versions']
	    }))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('dist/css'))
	    .pipe(browserSync.stream());
});