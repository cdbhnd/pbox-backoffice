(function (angular) {
    angular
        .module('pbox.box')
        .controller('boxOverviewController', boxOverviewController);

    /**@ngInject */
    function boxOverviewController($interval, $scope, $q, $timeout, $stateParams, $state, mapConfig, geolocationService,
        GeolocationModel, boxService, iotService) {
        var vm = this;
        var boxes = [];
        var filterInitialized = false;
        var listening = false;
        var center = null;

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

        vm.filterBoxes = filterBoxes;

        /////////////////////////////////////

        /**Activate */
        (function () {
            $scope.$on('$destroy', function () {
                iotService.stopListenAll();
            });
            startLoading()
                .then(getCurrentLocation)
                .then(loadBoxes)
                .then(filterBoxes)
                .then(listenBoxes)
                .then(loadMapMarkers)
                .then(setMapOptions)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function startLoading() {
            return $q.when(function () {
                vm.loading = true;
            });
        }

        function getCurrentLocation() {
            return geolocationService.getCurrentLocation()
                .then(function (coords) {
                    center = coords;
                    vm.mapOptions.mapCenter = center;
                    return true;
                });
        }

        function loadBoxes() {
            return boxService.getAllBoxes()
                .then(function (response) {
                    if (response) {
                        for (var i = 0; i < response.length; i++) {
                            boxes.push(response[i]);
                        }
                        for (i = 0; i < response.length; i++) {
                            if (boxes[i].status !== 'IDLE') {
                                vm.blueprintFilteredBoxes.push(boxes[i]);
                            }
                        }
                    } else {
                        vm.noResults = true;
                    }
                })
                .catch(function (e) {
                    console.log(e);
                });
        }

        function filterBoxes() {
            return $q.when(function () {
                var query = vm.filterQuery;

                vm.filteredBoxes.length = 0;
                var i;

                if (!query.activeStatus && query.sleepStatus) {
                    for (i = 0; i < vm.blueprintFilteredBoxes.length; i++) {
                        if (vm.blueprintFilteredBoxes[i].status === 'SLEEP') {
                            vm.filteredBoxes.push(vm.blueprintFilteredBoxes[i]);
                        }
                    }
                } else if (query.activeStatus && !query.sleepStatus) {
                    for (i = 0; i < vm.blueprintFilteredBoxes.length; i++) {
                        if (vm.blueprintFilteredBoxes[i].status === 'ACTIVE') {
                            vm.filteredBoxes.push(vm.blueprintFilteredBoxes[i]);
                        }
                    }
                } else if (!query.activeStatus && !query.sleepStatus) {
                    vm.filteredBoxes.length = 0;
                } else {
                    for (i = 0; i < vm.blueprintFilteredBoxes.length; i++) {
                        vm.filteredBoxes.push(vm.blueprintFilteredBoxes[i]);
                    }
                }

                if (!!query.code && query.code !== '') {
                    var helper = angular.copy(vm.filteredBoxes);
                    var searchQuery = query.code.toLowerCase();
                    vm.filteredBoxes.length = 0;
                    for (i = 0; i < helper.length; i++) {
                        var box = helper[i].code.toLowerCase();
                        if (box.includes(searchQuery)) {
                            vm.filteredBoxes.push(helper[i]);
                        }
                    }
                }

                if (vm.filteredBoxes.length === 0) {
                    vm.noResults = true;
                } else {
                    vm.noResults = false;
                }

                if (filterInitialized) {
                    loadMapMarkers();
                }
            }());
        }

        function listenBoxes() {
            return $q.when(function () {
                iotService.stopListenAll();
                if ((!!vm.filteredBoxes && vm.filteredBoxes.length !== 0) && !listening) {
                    listening = true;
                    var listeningBoxes = [];
                    for (var i = 0; i < vm.filteredBoxes.length; i++) {
                        if (vm.filteredBoxes[i].status === 'ACTIVE') {
                            listeningBoxes.push(vm.filteredBoxes[i]);
                        }
                    }
                    iotService.listenAll(listeningBoxes);
                } else {
                    listening = false;
                    iotService.stopListenAll();
                }
            }());
        }

        function loadMapMarkers() {
            return $q.when(function () {
                $scope.$watch('vm.filteredBoxes', function () {
                    vm.mapMarkers.length = 0;
                    for (var i = 0; i < vm.filteredBoxes.length; i++) {
                        if (!!vm.filteredBoxes[i].gps_sensor && vm.filteredBoxes[i].gps_sensor.value) {
                            setMarkerProperties(vm.filteredBoxes[i].gps_sensor.value);
                        }
                    }
                    filterInitialized = true;
                }, true);
            }())
                .then(listenBoxes);
        }

        function setMapOptions() {
            vm.mapOptions.mapCenter = vm.mapMarkers ? vm.mapMarkers[0] : center;
        }

        function setMarkerProperties(geolocationObj) {
            vm.mapMarkers.push({
                latitude: parseFloat(geolocationObj.latitude),
                longitude: parseFloat(geolocationObj.longitude)
            });
        }

        function stopLoading() {
            return $q.when(function () {
                vm.loading = false;
            });
        }
    }
})(window.angular);
