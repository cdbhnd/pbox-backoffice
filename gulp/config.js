(function() {
    'use strict';

    exports.paths = {
        config: 'config',
        dist: 'dist',
        node_modules: 'node_modules',
        src: 'src',
        tmp: '.tmp'
    };

    exports.environments = {
        DEVELOPMENT: 'development',
        PRODUCTION: 'production',
        STAGING: 'staging',
        TEST: 'test',
    };

    exports.environmentsConfig = {
        development: {},
        production: {},
        staging: {},
        test: {}
    };
}());