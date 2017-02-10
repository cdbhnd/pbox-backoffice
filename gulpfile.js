var argv = require('yargs').argv;
var gulp = require('gulp');
var config = require('./gulp/config');
var express = require('express');

// Detect and save environment (localy) by provided command line parameters
// Usage:
//    gulp                  start gulp task in 'development' mode, pointing to the local instance of the API (default)
//    gulp --test           start gulp task in 'development' mode, pointing to the remote instance of the API
//    gulp --staging        start gulp task in 'staging' mode
//    gulp --production     start gulp task in 'production' mode
//    gulp --XYZ            start gulp task in default 'development' mode
var _ENV = config.environments.DEVELOPMENT;
if (argv.test) { _ENV = config.environments.TEST; }
if (argv.staging) { _ENV = config.environments.STAGING; }
if (argv.production) { _ENV = config.environments.PRODUCTION; }

gulp.task('webserver', function() {
    if (!argv.buildonly) {
        var app = express();
        var port = 3002;
        app.use(express.static(__dirname + '/dist'));
        app.listen(port);
    }
});

gulp.task('default', ['webserver'], function() {
    require('./gulp/build.' + _ENV + '.js');
    gulp.start(_ENV);
});