(function() {
    'use strict';

    angular
        .module('pbox')
        .config(['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('hello', {
                    url: '',
                    templateUrl: 'app/hello/hello.html'
                })
                .state('realtime', {
                    url: '/realtime',
                    templateUrl: 'app/realtime/realtime.overview.html'
                })
                .state('management', {
                    url: '/management',
                    templateUrl: 'app/management/management.html'
                })
                .state('history', {
                    url: 'history',
                    templateUrl: 'app/history/history.html'
                });
        }]);
})();