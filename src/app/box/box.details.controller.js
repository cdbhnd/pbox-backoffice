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
        var boxCode = $stateParams.boxCode;
        vm.loading = false;
        vm.box = {
            code: null
        };
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(pollBoxesStatus)
                .then(loadBox)
                .then(loadMapMarker)
                .then(setMapOptions)
                .then(cancelPollingPromiseOnScopeDestroy)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function startLoading() {
            return $q.when(function() {
                vm.loading = true;
            });
        }

        function pollBoxesStatus() {
            return $q.when(function() {
                pollingPromise = $interval(function() {
                    return loadBoxesStatus();
                }, 10000);
                return true;
            }());
        }

        function loadBox() {
            return boxService.getSingleBox(boxCode)
                .then(function(response) {
                    vm.box = response;
                    vm.box.activate();
                    $scope.$on('$destroy', function() {
                        vm.box.deactivate();
                    });
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

        function setMapOptions() {
            vm.mapOptions.zoomControlOptions.position = google.maps.ControlPosition.RIGHT_CENTER;
            vm.mapOptions.streetViewControlOptions.position = google.maps.ControlPosition.RIGHT_CENTER;
            vm.mapOptions.mapCenter = vm.mapMarkers[0];
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
                .catch(function(e) {
                    console.log(e);
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