'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cleancss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jquery = require('jquery'),
	ggf = require('gulp-google-fonts'),
	ga = require('gulp-ga');

gulp.task('font', function () {
	return gulp.src('config_fonts.neon')
		.pipe(ggf())
		.pipe(gulp.dest('fonts'));
});

gulp.task('ga', function () {
	gulp.src('./dist/index.html')
		.pipe(
			ga({ 
				url: 'moerkerkelander.github.io/dist/', 
				uid: 'UA-110468690-1',
				anonymizeIp: false,
				demographics: true,
				linkAttribution: true,
				minify: true
			})
		)
		.pipe(gulp.dest('./dist/'));
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
		'node_modules/jquery/dist/jquery.min.js',
    	'script/*.js'
    ])
	.pipe(uglify().on('error', function (e) {
			console.log(e);
		}))
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('./dist/script'));
});

gulp.task('default', function(){
	gulp.watch(['style/*.scss', 'fonts/*.css'], ['css']);
	gulp.watch('script/*.js', ['script']);
});