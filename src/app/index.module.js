(function() {
    'use strict';

    angular.module('pbox', ['angularMoment',
        'ui.router',
        'ngStorage',
        'pbox.api',
        'pbox.realtime',
        'pbox.map',
        'pbox.geolocation',
        'pbox.header'
    ]);
})();