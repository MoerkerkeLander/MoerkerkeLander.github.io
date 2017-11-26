'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cleancss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jquery = require('jquery'),
	ggf = require('gulp-google-fonts');

gulp.task('font', function () {
	return gulp.src('config_fonts.neon')
		.pipe(ggf())
		.pipe(gulp.dest('fonts'));
});

gulp.task('css', function(){
	gulp.src([
		'fonts/*.css',
		'style/screen.scss'
	])
	.pipe(sass().on('error', sass.logError))
	.pipe(concat('screen.min.css'))
	.pipe(cleancss())
	.pipe(gulp.dest('./dist/style'));
});

gulp.task('script', function () {
    gulp.src([
		'node_modules/jquery/dist/jquery.js',
    	'script/*.js'
    ])
    // .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('./dist/script'));
});

gulp.task('js', function() {
    gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'src/js/**/*.js'
        ])
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('web/dist/js'));
});

gulp.task('default', function(){
	gulp.watch(['style/*.scss', 'fonts/*.css'], ['css']);
	gulp.watch('script/*.js', ['script']);
	jquery.help;
});