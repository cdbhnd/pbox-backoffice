(function() {
    'use strict';

    angular
        .module('pbox.realtime')
        .controller('realtimeController', realtimeController);

    /** @ngInject */
    function realtimeController($interval, $scope, $q, $timeout, $stateParams, $state, mapConfig, geolocationService) {

        var vm = this;

        // public methods
        // vm.showOnMap = showOnMap;

        //variables and properties
        var pollingPromise;
        vm.loading;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.markerColors = ['#33CBCC', '#3F5877'];
        vm.boxes = [];

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(pollBoxesStatus)
                .then(getCurrentLocation)
                .then(loadMapOptions)
                .then(loadBoxes)
                .then(loadMapMarkers)
                .then(cancelPollingPromiseOnScopeDestroy)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function getCurrentLocation() {
            return geolocationService.currentLocation()
                .then(function(coords) {
                    vm.mapOptions.mapCenter = coords;
                    return true;
                });
        }

        function loadBoxes() {
            return realtimeService.get()
                .then(function(response) {
                    vm.boxes = response;
                    if (!response) {
                        console.log('Job could not be found !');
                    }
                })
                .catch(function(err) {
                    console.log('Job could not be found !');
                });
        }

        function loadMapMarkers() {
            return $q.when(function() {
                for (var i = 0; i < vm.boxes.length; i++) {
                    if (!!vm.boxes[i]) {
                        vm.mapMarkers.push(vm.boxes[i]);
                    }
                }
            }());
        }

        function loadMapOptions() {
            return $q.when(function() {
                vm.mapOptions.disableDefaultUI = true;
                vm.mapOptions.zoomControl = false;
                vm.mapOptions.streetViewControl = false;
                vm.mapOptions.draggable = false;
                vm.mapOptions.scrollwheel = false;
                vm.mapOptions.disableDoubleClickZoom = true;
                return true;
            }());
        }

        function loadBoxesStatus() {
            if (!vm.box) {
                return true;
            }

            return realtimeService.getBoxStatus(vm.job.box)
                .then(function(response) {
                    vm.box.status = response.status;
                    return true;
                })
                .catch(function(err) {
                    console.log(err);
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

        function startLoading() {
            vm.loading = true;
        }

        function stopLoading() {
            vm.loading = false;
        }
    }
})();