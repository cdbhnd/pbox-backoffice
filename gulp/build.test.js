(function() {
    'use strict';

    // import watchers and base tasks
    require('./build.base.js');
    require('./watch.js');

    var config = require('./config.js');
    var gulp = require('gulp');
    var gulpsync = require('gulp-sync')(gulp);
    var argv = require('yargs').argv;

    // main development task
    if (argv.buildonly) {
        gulp.task(config.environments.TEST, gulpsync.sync([
            'base',
            'development-js',
            'development-css'
        ]));
    } else {
        gulp.task(config.environments.TEST, gulpsync.sync([
            'base',
            'development-js',
            'development-css',
            'watch-changes'
        ]));
    }

    // copy css from temp to dist folder
    gulp.task('development-css', function() {
        gulp.src(config.paths.tmp + '/styles/*')
            .pipe(gulp.dest(config.paths.dist + '/styles'));
    });

    // copy libraries and application files from temp to dist folder
    gulp.task('development-js', function() {
        gulp.src(config.paths.tmp + '/js/*')
            .pipe(gulp.dest(config.paths.dist + '/js'));
    });
}(require));
