(function() {
    'use strict';

    // import watchers and base tasks
    require('./build-base.js');
    require('./watch.js');

    var config = require('./config.js');
    var gulp = require('gulp');
    var gulpsync = require('gulp-sync')(gulp);

    // main development task
    gulp.task(config.environments.DEVELOPMENT, gulpsync.sync([
        'extractLocalizationKeys',
        'base',
        'development-js',
        'development-css',
        'watch-changes'
    ]));

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

    // localization extraction
    var extractTranslate = require('gulp-angular-translate-extractor');
    gulp.task('extractLocalizationKeys', function() {
        var i18nsrc = config.paths.src + '/app/**/*.html';
        var i18ndest = config.paths.src + '/data/localization';

        return gulp.src(i18nsrc)
            .pipe(extractTranslate({
                defaultLang: 'en-GB',
                lang: ['en-GB', 'de-DE'],
                dest: i18ndest,
                safeMode: true, // true: do not delete old translations, false: delete them
                stringifyOptions: true // true: force json to be sorted, false - contrariwise
            }))
            .pipe(gulp.dest(i18ndest));
    });

}(require));
