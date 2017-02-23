(function() {
    angular
        .module('pbox.realtime')
        .service('realtimeService', realtimeService);

    /** @ngInject */
    function realtimeService(pboxApi, config, BoxModel) {

        var service = this;

        service.getAllBoxes = getAllBoxes;

        ///////////////////////////////////////////

        function getAllBoxes() {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.BOXES
                })
                .then(function(response) {
                    var boxes = [];
                    if (response) {
                        for (var i = 0; i < response.length; i++) {
                            boxes[i] = new BoxModel(response[i]);
                        }
                    }
                    return boxes;
                })
                .catch(function(e) {
                    console.log(e);
                });
        }
    }
})();