(function(require) {
    'use strict';

    var argv = require('yargs').argv;
    var concatenate = require('gulp-concat');
    var config = require('./config');
    var del = require('del');
    var gulp = require('gulp');
    var gulpsync = require('gulp-sync')(gulp);
    var minifyCss = require('gulp-minify-css');
    var ngAnotate = require('gulp-ng-annotate');
    var sourcemaps = require('gulp-sourcemaps');
    var mergeJson = require('gulp-merge-json');
    var preprocess = require('gulp-preprocess');
    var rev = require('gulp-rev');
    var revReplace = require('gulp-rev-replace');
    var revdel = require('gulp-rev-delete-original');
    var templateCache = require('gulp-angular-templatecache');
    var sass = require('gulp-sass');

    // to do: this is repeated code from gulpfile.js
    // find a way to set _ENV globaly
    // refactor!
    var _ENV = config.environments.DEVELOPMENT;
    if (argv.test) {
        _ENV = config.environments.TEST;
    }
    if (argv.staging) {
        _ENV = config.environments.STAGING;
    }
    if (argv.production) {
        _ENV = config.environments.PRODUCTION;
    }
    var _ENV_CONFIG = config.environmentsConfig[_ENV];

    // main gulp base task
    // do not change the execution order of the tasks!
    gulp.task('base', gulpsync.sync(['clean', 'config', 'data', 'templateCache', 'libraries', 'app', 'styles', 'fonts', 'icons', 'images', 'favicon', 'index']));

    gulp.task('config', function() {
        gulp.src([
                config.paths.config + '/base/*.json',
                config.paths.config + '/' + _ENV + '/*.json'
            ])
            .pipe(mergeJson('config.json'))
            .pipe(gulp.dest(config.paths.tmp + '/config'))
            .pipe(mergeJson(config.paths.tmp + '/config/config.json', function(jsonData) {
                gulp.src(['gulp/module.config.js'])
                    .pipe(preprocess({ context: { FOO: JSON.stringify(jsonData).replace(/\'/g, '') } }))
                    .pipe(gulp.dest(config.paths.tmp + '/config/'));
            }));
    });

    gulp.task('data', function() {
        gulp.src([
                config.paths.src + '/data/**'
            ])
            .pipe(gulp.dest(config.paths.dist + '/data'));
    });

    gulp.task('clean', function() {
        return del.sync([
            config.paths.dist,
            config.paths.tmp
        ]);
    });

    gulp.task('fonts', function() {
        return gulp.src([
                config.paths.src + '/fonts/*.*',
                config.paths.node_modules + '/bootstrap/dist/fonts/*.*'
            ])
            .pipe(gulp.dest(config.paths.dist + '/fonts'));
    });

    gulp.task('icons', function() {
        return gulp.src([
                config.paths.src + '/assets/icons/*/*.*'
            ])
            .pipe(gulp.dest(config.paths.dist + '/icons'));
    });

    gulp.task('index', function() {
        var _manifest = gulp.src('rev-manifest.json');
        return gulp.src([
                config.paths.src + '/index.html'
            ])
            .pipe(preprocess({ context: { ENV: _ENV, ENV_CONFIG: _ENV_CONFIG, DEBUG: (_ENV == config.environments.DEVELOPMENT) } }))
            .pipe(revReplace({ manifest: _manifest }))
            .pipe(gulp.dest(config.paths.dist));
    });

    gulp.task('templateCache', function() {
        return gulp.src([
                config.paths.src + '/app/**/*.html'
            ])
            .pipe(preprocess({ context: { ENV: _ENV, ENV_CONFIG: _ENV_CONFIG, DEBUG: (_ENV == config.environments.DEVELOPMENT) } }))
            .pipe(templateCache('templateCache.js', {
                module: 'pbox',
                root: 'app'
            }))
            .pipe(gulp.dest(config.paths.tmp + '/templateCache/'));
    });

    gulp.task('libraries', function() {
        return gulp.src([
                config.paths.node_modules + '/angular/angular.min.js',
                config.paths.node_modules + '/angular-ui-router/release/angular-ui-router.min.js',
                config.paths.node_modules + '/ngstorage/ngStorage.min.js',
                config.paths.node_modules + '/moment/min/moment.min.js',
                config.paths.node_modules + '/angular-moment/angular-moment.min.js',
                config.paths.node_modules + '/stompjs/lib/stomp.min.js',
                config.paths.node_modules + '/jquery/dist/jquery.min.js',
                config.paths.node_modules + '/bootstrap/dist/js/bootstrap.min.js'
            ])
            .pipe(concatenate('libraries.js'))
            .pipe(rev())
            .pipe(gulp.dest(config.paths.tmp + '/js'))
            .pipe(rev.manifest('rev-manifest.json', { base: process.cwd() + '/' + config.paths.src, merge: true }))
            .pipe(gulp.dest(config.paths.src));
    });

    gulp.task('app', function() {
        return gulp.src([
                config.paths.src + '/app/index.module.js',
                config.paths.src + '/app/**/*.module.js',
                config.paths.tmp + '/config/*.js',
                config.paths.src + '/app/**/*.js',
                config.paths.tmp + '/templateCache/*.js'
            ])
            .pipe(sourcemaps.init())
            .pipe(concatenate('app.js'))
            .pipe(preprocess({ context: { ENV: _ENV, ENV_CONFIG: _ENV_CONFIG, DEBUG: (_ENV == config.environments.DEVELOPMENT) } }))
            .pipe(ngAnotate())
            .pipe(rev())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.paths.tmp + '/js'))
            .pipe(rev.manifest('rev-manifest.json', { base: process.cwd() + '/' + config.paths.src, merge: true }))
            .pipe(gulp.dest(config.paths.src));
    });

    gulp.task('styles', function() {
        return gulp.src([
                config.paths.src + '/assets/scss/index.scss',
                config.paths.node_modules + '/bootstrap/dist/css/bootstrap.min.css',
                config.paths.node_modules + '/bootstrap/dist/js/bootstrap-theme.min.css'
            ])
            .pipe(sass().on('error', sass.logError))
            .pipe(concatenate('styles.css'))
            .pipe(minifyCss())
            .pipe(rev())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.paths.tmp + '/styles'))
            .pipe(rev.manifest('rev-manifest.json', { base: +'/' + config.paths.src, merge: true }))
            .pipe(gulp.dest(config.paths.src));
    });

    gulp.task('images', function() {
        gulp.src([
                config.paths.src + '/assets/images/*',
                config.paths.bower_components + '/intl-tel-input/build/img/*'
            ])
            .pipe(gulp.dest(config.paths.dist + '/images'));
    });

    gulp.task('favicon', function() {
        gulp.src([
                config.paths.src + '/assets/favicon/*',
            ])
            .pipe(gulp.dest(config.paths.dist));
    });
}(require));