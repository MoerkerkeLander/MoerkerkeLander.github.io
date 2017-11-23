'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cleancss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jquery = require('jquery');

gulp.task('sass', function(){
	gulp.src('style/screen.scss')
    	.pipe(sass().on('error', sass.logError))
    	.pipe(cleancss())
    	.pipe(gulp.dest('./dist/style'));
});

gulp.task('script', function () {
    gulp.src([
    	'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
    	'script/*.js'
    ])
    .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('./dist/script'));
});

gulp.task('js', function() {
    gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'src/js/**/*.js'
        ])
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('web/dist/js'));
});

gulp.task('default', function(){
	gulp.watch('style/*.scss', ['sass']);
	gulp.watch('script/*.js', ['script']);
	jquery.help;
});