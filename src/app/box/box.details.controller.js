(function() {
    'use strict';

    angular
        .module('pbox.box')
        .controller('boxDetailsController', boxDetailsController);

    /** @ngInject */
    function boxDetailsController($q, $scope, $interval, $stateParams, $state, mapConfig, boxService, geolocationService) {

        var vm = this;

        // public methods

        //variables and properties
        var pollingPromise;
        var boxCode;
        vm.loading = false;
        vm.box = {
            code: null
        };
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(initializeState)
                .then(pollBoxesStatus)
                .then(setMapOptions)
                .then(getCurrentLocation)
                .then(loadBox)
                .then(loadMapMarker)
                .then(cancelPollingPromiseOnScopeDestroy)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function startLoading() {
            return $q.when(function() {
                vm.loading = true;
            });
        }

        function initializeState() {
            vm.box.code = $stateParams.boxCode;
        }

        function pollBoxesStatus() {
            return $q.when(function() {
                pollingPromise = $interval(function() {
                    return loadBoxesStatus();
                }, 10000);
                return true;
            }());
        }

        function setMapOptions() {
            vm.mapOptions.zoomControlOptions.position = google.maps.ControlPosition.RIGHT_CENTER;
            vm.mapOptions.streetViewControlOptions.position = google.maps.ControlPosition.RIGHT_CENTER;
        }

        function getCurrentLocation() {
            return geolocationService.getCurrentLocation()
                .then(function(coords) {
                    vm.mapOptions.mapCenter = coords;
                    return true;
                });
        }

        function loadBox() {
            return boxService.getSingleBox(vm.box.code)
                .then(function(response) {
                    vm.box = response;
                    return true;
                });
        }

        function loadMapMarker() {
            return $q.when(function() {
                if (!!vm.box && vm.box.gps_sensor) {
                    setMarkerProperties(vm.box.gps_sensor.value);
                }
            }());
        }

        function cancelPollingPromiseOnScopeDestroy() {
            return $q.when(function() {
                $scope.$on('$destroy', function() {
                    if (!!pollingPromise) {
                        $interval.cancel(pollingPromise);
                    }
                });
                return true;
            }());
        }

        function stopLoading() {
            return $q.when(function() {
                vm.loading = false;
            });
        }

        ///////////////////////////////////// helper function's

        function loadBoxesStatus() {
            if (!vm.box) {
                return true;
            }

            return boxService.getBoxStatus(vm.box.code)
                .then(function(response) {
                    vm.box.status = response.status;
                    return true;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }

        function setMarkerProperties(geolocationObj) {
            vm.mapMarkers.push({
                latitude: parseFloat(geolocationObj.latitude),
                longitude: parseFloat(geolocationObj.longitude)
            });
        }
    }
})();