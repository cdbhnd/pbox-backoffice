(function (angular) {
    angular
        .module('pbox.box')
        .service('boxService', boxService);

    /**@ngInject */
    function boxService(pboxApi, config, BoxModel) {
        var service = this;

        service.getAllBoxes = getAllBoxes;
        service.getSingleBox = getSingleBox;
        service.getBoxStatus = getBoxStatus;
        service.deleteBox = deleteBox;
        service.syncBox = syncBox;
        service.setBoxStatus = setBoxStatus;

        ///////////////////////////////////////////

        function getAllBoxes() {
            return pboxApi.http({
                method: config.httpMethods.GET,
                url: config.pboxAPI.BOXES
            })
            .then(function (response) {
                var boxes = [];
                if (response) {
                    for (var i = 0; i < response.length; i++) {
                        boxes[i] = new BoxModel(response[i]);
                    }
                }
                return boxes;
            });
        }

        function getSingleBox(boxCode) {
            return pboxApi.http({
                method: config.httpMethods.GET,
                url: config.pboxAPI.BOXES + '/' + boxCode
            })
            .then(function (response) {
                var box;
                box = new BoxModel(response);
                return box;
            });
        }

        function getBoxStatus(boxCode) {
            return pboxApi.http({
                method: config.httpMethods.GET,
                url: config.pboxAPI.BOXES + '/' + boxCode + '/status'
            })
            .then(function (response) {
                return response;
            });
        }

        function deleteBox(boxCode) {
            return pboxApi.http({
                method: config.httpMethods.DELETE,
                url: config.pboxAPI.BOXES + '/' + boxCode
            });
        }

        function syncBox(boxCode) {
            return pboxApi.http({
                method: config.httpMethods.POST,
                url: config.pboxAPI.BOXES + '/' + boxCode + '/sync'
            });
        }

        function setBoxStatus(boxCode, status) {
            return pboxApi.http({
                method: config.httpMethods.POST,
                url: config.pboxAPI.BOXES + '/' + boxCode + '/status',
                data: {
                    status: status
                }
            });
        }
    }
})(window.angular);
