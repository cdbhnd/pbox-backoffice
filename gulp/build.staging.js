(function() {
    'use strict';

    // import base tasks
    require('./build.base');

    var config = require('./config');
    var gulp = require('gulp');
    var gulpsync = require('gulp-sync')(gulp);

    // main staging task
    gulp.task(config.environments.STAGING, gulpsync.sync([
        'base',
        'staging-js',
        'staging-css'
    ]));

    // copy css from temp to dist folder
    gulp.task('staging-css', function() {
        gulp.src(config.paths.tmp + '/v2/styles/*')
            .pipe(gulp.dest(config.paths.dist + '/v2/styles'));
    });

    // copy application and library files from temp to dist folder
    gulp.task('staging-js', function() {
        gulp.src(config.paths.tmp + '/v2/js/*')
            .pipe(gulp.dest(config.paths.dist + '/v2/js'));
    });
}(require));
