(function() {
    'use strict';

    angular
        .module('pbox', ['angularMoment', 
            'ngNotify',
            'ui.router',
            'ngStorage',
            'ui.bootstrap',
            'pbox.api',
            'pbox.box',
            'pbox.map',
            'pbox.geolocation',
            'pbox.header',
            'pbox.history',
            'pbox.management',
            'pbox.auth',
            'pbox.iot',
            'pbox.loader',
            'pbox.popup'
        ])
        .run(function($rootScope, $state, authService) {
            authService.init();
            $rootScope.current_state = $state.current;
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    $rootScope.current_state = toState;
                    $rootScope.previous_state = fromState;
                });
        });
})();