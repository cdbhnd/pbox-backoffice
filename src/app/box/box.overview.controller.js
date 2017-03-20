(function (angular) {
    angular
        .module('pbox.box')
        .controller('boxOverviewController', boxOverviewController);

    /**@ngInject */
    function boxOverviewController($interval, $scope, $q, $timeout, $stateParams, $state, mapConfig, geolocationService,
        GeolocationModel, boxService, iotService, BoxFilterModel) {
        var vm = this;
        var filterInitialized = false;
        var listening = false;
        var center = null;

        vm.loading = false;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.filteredBoxes = [];
        vm.filterQuery = new BoxFilterModel();
        vm.blueprintFilteredBoxes = [];
        vm.noResults = false;

        vm.filterBoxes = filterBoxes;

        /////////////////////////////////////

        /**Activate */
        (function () {
            $scope.$on('$destroy', function () {
                iotService.stopListenAllBoxes();
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
                            if (response[i].status !== 'IDLE') {
                                vm.blueprintFilteredBoxes.push(response[i]);
                            }
                        }
                    } else {
                        vm.noResults = true;
                    }
                });
        }

        function filterBoxes() {
            return $q.when(function () {
                vm.filteredBoxes.length = 0;
                for (var i = 0; i < vm.blueprintFilteredBoxes.length; i++) {
                    if (vm.filterQuery.match(vm.blueprintFilteredBoxes[i])) {
                        vm.filteredBoxes.push(vm.blueprintFilteredBoxes[i]);
                    }
                }
                vm.noResults = !vm.filteredBoxes.length;
                if (filterInitialized) {
                    loadMapMarkers();
                }
                return vm.filteredBoxes;
            }());
        }

        function listenBoxes() {
            return $q.when(function () {
                iotService.stopListenAllBoxes();
                if ((!!vm.filteredBoxes && vm.filteredBoxes.length !== 0) && !listening) {
                    listening = true;
                    var listeningBoxes = [];
                    for (var i = 0; i < vm.filteredBoxes.length; i++) {
                        if (vm.filteredBoxes[i].status === 'ACTIVE') {
                            listeningBoxes.push(vm.filteredBoxes[i]);
                        }
                    }
                    iotService.listenAllBoxes(listeningBoxes);
                } else {
                    listening = false;
                    iotService.stopListenAllBoxes();
                }
            }());
        }

        function loadMapMarkers() {
            return $q.when(function () {
                $scope.$watch('vm.filteredBoxes', function () {
                    vm.mapMarkers.length = 0;
                    for (var i = 0; i < vm.filteredBoxes.length; i++) {
                        if (!!vm.filteredBoxes[i].gpsSensor && vm.filteredBoxes[i].gpsSensor.value) {
                            setMarkerProperties(vm.filteredBoxes[i].gpsSensor.value);
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
