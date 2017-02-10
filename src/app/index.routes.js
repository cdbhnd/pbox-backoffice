(function() {
    'use strict';

    angular
        .module('pbox')
        .config(['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('hello', {
                    url: '',
                    templateUrl: 'app/hello/hello.html'
                });
        }]);
})();