(function() {
    'use strict';

    angular
        .module('pbox.box')
        .controller('boxOverviewController', boxOverviewController);

    /** @ngInject */
    function boxOverviewController($interval, $scope, $q, $timeout, $stateParams, $state, mapConfig, geolocationService, boxService) {

        var vm = this;

        // public methods
        vm.filterBoxes = filterBoxes;

        //variables and properties
        var pollingPromise;
        var boxes = [];
        var filterInitialized = false;
        vm.loading = false;
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
            startLoading()
                // .then(pollBoxesStatus)
                .then(getCurrentLocation)
                .then(loadBoxes)
                .then(filterBoxes)
                .then(loadMapMarkers)
                // .then(cancelPollingPromiseOnScopeDestroy)
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

        function getCurrentLocation() {
            return geolocationService.getCurrentLocation()
                .then(function(coords) {
                    vm.mapOptions.mapCenter = coords;
                    return true;
                });
        }

        function loadBoxes() {
            return boxService.getAllBoxes()
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
                        vm.noResults = true;
                    }
                })
                .catch(function(e) {
                    console.log(e);
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

        ////////////////////////////////////////////// helper function's

        function loadBoxesStatus() {
            if (!vm.blueprintFilteredBoxes) {
                return true;
            }
            for (var i = 0; i < vm.blueprintFilteredBoxes.length; i++) {
                if (!!vm.blueprintFilteredBoxes[i]) {
                    startStatusPolling(vm.blueprintFilteredBoxes[i]);
                }
            }
            return true;
        }

        function startStatusPolling(box) {
            boxService.getBoxStatus(box.code)
                .then(function(response) {
                    box.status = response.status;
                })
                .catch(function(e) {
                    console.log(e);
                });
        }
    }
})();