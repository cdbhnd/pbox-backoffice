(function() {
    'use strict';

    angular
        .module('pbox')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('login', {
                    url: '/',
                    templateUrl: 'app/auth/auth.login.html'
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