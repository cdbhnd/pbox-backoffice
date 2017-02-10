(function() {
    'use strict';

    // import base tasks
    require('./build.base');

    var config = require('./config');
    var gulp = require('gulp');
    var gulpsync = require('gulp-sync')(gulp);
    var uglify = require('gulp-uglify');

    // main production task
    gulp.task(config.environments.PRODUCTION, gulpsync.sync([
        'base',
        'production-js',
        'production-css'
    ]));

    // copy css from temp to dist folder, without mapping
    gulp.task('production-css', function() {
        gulp.src(config.paths.tmp + '/v2/styles/stylesv2.css')
            .pipe(gulp.dest(config.paths.dist + '/v2/styles'));
    });

    // copy application and library files from temp to dist folder, without mapping
    gulp.task('production-js', function() {
        gulp.src(config.paths.tmp + '/v2/js/libraries.js')
            .pipe(uglify())
            .pipe(gulp.dest(config.paths.dist + '/v2/js'));

        gulp.src(config.paths.tmp + '/v2/js/app.js')
            .pipe(uglify())
            .pipe(gulp.dest(config.paths.dist + '/v2/js'));
    });
}(require));
