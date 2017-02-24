(function() {
    'use strict';

    angular
        .module('pbox')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('login', {
                    url: '',
                    templateUrl: 'app/auth/auth.login.html'
                })
                .state('boxes-overview', {
                    url: '/boxes-overview',
                    templateUrl: 'app/box/box.overview.html'
                })
                .state('box-details', {
                    url: '/boxes-overview/box-details/{boxCode}',
                    templateUrl: 'app/box/box.details.html'
                })
                .state('management', {
                    url: '/management',
                    templateUrl: 'app/management/management.html'
                })
                .state('history', {
                    url: '/history',
                    templateUrl: 'app/history/history.html'
                });
        }]);
})();