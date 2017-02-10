(function() {
    'use strict';

    var config = require('./config');
    var gulp = require('gulp');
    var gulpsync = require('gulp-sync')(gulp);

    // watch for changes and activate corresponding tasks
    gulp.task('watch-changes', function() {
        gulp.watch(
            [
                config.paths.src + '/**/*.html'
            ], ['reload-js']);

        gulp.watch(
            [
                config.paths.src + '/app/index.module.js',
                config.paths.src + '/app/**/*.module.js',
                config.paths.src + '/app/**/*.js'
            ], ['reload-js']);

        gulp.watch(
            [
                config.paths.src + '/assets/scss/*.scss',
                config.paths.src + '/assets/scss/**/*.scss'
            ], ['reload-css']);

        gulp.watch(
            [
                config.paths.src + '/assets/images/*'
            ], ['images']);

        gulp.watch(
            [
                config.paths.src + '/data/**'
            ], ['data']);
    });

    gulp.task('reload-js', gulpsync.sync(['templateCache', 'app', 'development-js', 'index']));
    gulp.task('reload-css', gulpsync.sync(['styles', 'development-css']));

}(require));