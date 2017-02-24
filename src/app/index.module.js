(function() {
    'use strict';

    angular.module('pbox', ['angularMoment',
            'ui.router',
            'ngStorage',
            'pbox.api',
            'pbox.box',
            'pbox.map',
            'pbox.geolocation',
            'pbox.header',
            'pbox.history',
            'pbox.management',
            'pbox.auth',
            'pbox.iot',
            'pbox.loader'
        ])
        .run(function($rootScope, $state, authService) {
            authService.init();
            $rootScope.current_state = $state.current;
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    $rootScope.current_state = toState;
                });
        });
})();