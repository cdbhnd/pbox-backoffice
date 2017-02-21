(function() {
    'use strict';

    angular
        .module('pbox')
        .factory('GeolocationModel', geolocationModelFactory);

    /** @ngInject */
    function geolocationModelFactory() {

        function GeolocationModel(obj) {
            this.latitude = obj && obj.latitude ? obj.latitude : null;
            this.longitude = obj && obj.longitude ? obj.longitude : null;
        }

        GeolocationModel.prototype.valid = function() {
            return (!!this.latitude && !!this.longitude);
        }

        return GeolocationModel;
    }
})();