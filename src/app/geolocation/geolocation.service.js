(function (angular) {
    angular
        .module('pbox.geolocation')
        .service('geolocationService', geolocationService);

    /**@ngInject */
    function geolocationService($q, $window, GeolocationModel) {
        var service = this;

        service.getCurrentLocation = getCurrentLocation;

        //////////////////////////////

        function getCurrentLocation() {
            var deferred = $q.defer();

            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                $window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var coords = new GeolocationModel;
                        coords.latitude = position.coords.latitude;
                        coords.longitude = position.coords.longitude;
                        deferred.resolve(coords);
                    },
                    function () {
                        var fallbackCoords = new GeolocationModel();
                        fallbackCoords.latitude = 44.811155;
                        fallbackCoords.longitude = 20.446182;
                        deferred.resolve(fallbackCoords);
                    });
            }

            return deferred.promise;
        }
    }
})(window.angular);
