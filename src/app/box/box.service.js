(function() {
    angular
        .module('pbox.box')
        .service('boxService', boxService);

    /** @ngInject */
    function boxService(pboxApi, config, BoxModel) {

        var service = this;

        service.getAllBoxes = getAllBoxes;
        service.getSingleBox = getSingleBox;
        service.getBoxStatus = getBoxStatus;

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

        function getSingleBox(boxCode) {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.BOXES + '/' + boxCode
                })
                .then(function(response) {
                    var box;
                    box = new BoxModel(response);
                    return box;
                })
                .catch(function(e) {
                    console.log(e);
                })
        }

        function getBoxStatus(boxCode) {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.BOXES + '/' + boxCode + '/status'
                })
                .then(function(response) {
                    return response;
                })
                .catch(function(e) {
                    console.log(e);
                });
        }
    }
})();