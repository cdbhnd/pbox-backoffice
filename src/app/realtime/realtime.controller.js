(function() {
    'use strict';

    angular
        .module('pbox.realtime')
        .controller('realtimeController', realtimeController);

    /** @ngInject */
    function realtimeController($interval, $scope, $q, $timeout, $stateParams, $state, mapConfig, geolocationService, realtimeService) {

        var vm = this;

        // public methods

        //variables and properties
        var pollingPromise;
        vm.loading;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.boxes = [];
        vm.activeBoxes = false;

        /////////////////////////////////////

        (function activate() {
            console.dir(vm);
            startLoading()
                .then(pollBoxesStatus)
                .then(getCurrentLocation)
                .then(loadBoxes)
                .then(loadMapMarkers)
                .then(cancelPollingPromiseOnScopeDestroy)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function getCurrentLocation() {
            return geolocationService.getCurrentLocation()
                .then(function(coords) {
                    vm.mapOptions.mapCenter = coords;
                    return true;
                });
        }

        function loadBoxes() {
            return realtimeService.getAllBoxes()
                .then(function(response) {
                    if (response) {
                        for (var i = 0; i < response.length; i++) {
                            vm.boxes.push(response[i]);
                        }
                    } else {
                        console.log('Job could not be found !');
                    }
                })
                .catch(function(e) {
                    console.log(e);
                });
        }

        function loadMapMarkers() {
            return $q.when(function() {
                for (var i = 0; i < vm.boxes.length; i++) {
                    if (!!vm.boxes[i] && vm.boxes[i].gps_sensor) {
                        vm.mapMarkers.push(vm.boxes[i]);
                    }
                }
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
            return $q.when(function() {
                vm.loading = true;
            });
        }

        function stopLoading() {
            return $q.when(function() {
                vm.loading = false;
            });
        }
    }
})();