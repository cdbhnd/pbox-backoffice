(function() {
    'use strict';

    angular
        .module('pbox.realtime')
        .controller('realtimeController', realtimeController);

    /** @ngInject */
    function realtimeController($interval, $scope, $q, $timeout, $stateParams, $state, mapConfig, geolocationService, realtimeService) {

        var vm = this;

        // public methods
        vm.filterBoxes = filterBoxes;

        //variables and properties
        var pollingPromise;
        var boxes = [];
        var filterInitialized = false;
        vm.loading;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.filteredBoxes = [];
        vm.filterQuery = {
            code: null,
            activeStatus: true,
            sleepStatus: false
        };
        vm.blueprintFilteredBoxes = [];
        vm.noResults = false;
        /////////////////////////////////////

        (function activate() {
            console.dir(vm);
            startLoading()
                .then(pollBoxesStatus)
                .then(getCurrentLocation)
                .then(loadBoxes)
                .then(filterBoxes)
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
                            boxes.push(response[i]);
                        }
                        for (var i = 0; i < response.length; i++) {
                            if (boxes[i].status != 'IDLE') {
                                vm.blueprintFilteredBoxes.push(boxes[i]);
                            }
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
                vm.mapMarkers.length = 0;
                for (var i = 0; i < vm.filteredBoxes.length; i++) {
                    if (!!vm.filteredBoxes[i] && vm.filteredBoxes[i].gps_sensor) {
                        setMarkerProperties(vm.filteredBoxes[i].gps_sensor.value);
                    }
                }
                filterInitialized = true;
            }());
        }

        function setMarkerProperties(geolocationObj) {
            vm.mapMarkers.push({
                latitude: parseFloat(geolocationObj.latitude),
                longitude: parseFloat(geolocationObj.longitude)
            });
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

        function filterBoxes() {
            return $q.when(function() {
                var query = vm.filterQuery;

                vm.filteredBoxes.length = 0;

                if (!query.activeStatus && query.sleepStatus) {
                    for (var i = 0; i < vm.blueprintFilteredBoxes.length; i++) {
                        if (vm.blueprintFilteredBoxes[i].status == 'SLEEP') {
                            vm.filteredBoxes.push(vm.blueprintFilteredBoxes[i]);
                        }
                    }
                } else if (query.activeStatus && !query.sleepStatus) {
                    for (var i = 0; i < vm.blueprintFilteredBoxes.length; i++) {
                        if (vm.blueprintFilteredBoxes[i].status == 'ACTIVE') {
                            vm.filteredBoxes.push(vm.blueprintFilteredBoxes[i]);
                        }
                    }
                } else if (!query.activeStatus && !query.sleepStatus) {
                    vm.filteredBoxes.length = 0;
                } else {
                    for (var i = 0; i < vm.blueprintFilteredBoxes.length; i++) {
                        vm.filteredBoxes.push(vm.blueprintFilteredBoxes[i]);
                    }
                }

                if (!!query.code && query.code != '') {
                    var helper = angular.copy(vm.filteredBoxes);
                    vm.filteredBoxes.length = 0;
                    for (var i = 0; i < helper.length; i++) {
                        if (helper[i].code == query.code) {
                            vm.filteredBoxes.push(helper[i]);
                        }
                    }
                }

                if (vm.filteredBoxes.length == 0) {
                    vm.noResults = true;
                } else {
                    vm.noResults = false;
                }

                if (filterInitialized) {
                    loadMapMarkers();
                }
            }());
        }
    }
})();