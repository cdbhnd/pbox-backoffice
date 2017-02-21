(function() {
    angular
        .module('pbox.realtime')
        .service('realtimeService', realtimeService);

    /** @ngInject */
    function realtimeService(pboxApi) {

        var service = this;

        service.get = getAllBoxes;

        ///////////////////////////////////////////

        function getAllBoxes() {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.BOXES
                })
                .then(function(response) {
                    var jobs = [];

                });
        }
    }
})();