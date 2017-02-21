(function() {
    'use strict';

    angular
        .module('pbox.api')
        .service('pboxApi', pboxApi);

    /** @ngInject */
    function pboxApi($http, config, $localStorage) {
        var service = this;

        service.http = http;

        //////////////////////////////////

        function http(params) {

            params.url = config.pboxAPI.HOST + params.url;

            if (!!$localStorage.current_user && !!$localStorage.current_user.token) {
                if (!params.headers) {
                    params.headers = {};
                }
                params.headers.Authorization = 'Bearer ' + $localStorage.current_user.token;
            }

            return $http(params)
                .then(function(response) {
                    return response.data;
                });
        }
    }
})();