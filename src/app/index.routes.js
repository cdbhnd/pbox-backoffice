(function (angular) {
    angular
        .module('pbox')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('login', {
                    url: '',
                    templateUrl: 'app/auth/auth.login.html',
                    data: {
                        hideHeader: true
                    }
                })
                .state('boxes-overview', {
                    url: '/boxes-overview',
                    templateUrl: 'app/box/box.overview.html'
                })
                .state('box-details', {
                    url: '/boxes-overview/{boxCode}',
                    templateUrl: 'app/box/box.details.html',
                    data: {
                        showBackButton: true
                    }
                })
                .state('management', {
                    url: '/management',
                    templateUrl: 'app/management/management.html'
                })
                .state('history', {
                    url: '/history',
                    templateUrl: 'app/history/history.html'
                });

            $urlRouterProvider.otherwise('/');
        }]);
})(window.angular);
