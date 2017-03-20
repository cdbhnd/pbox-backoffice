(function (angular, google) {
    angular
        .module('pbox.map')
        .directive('mapPane', mapPaneDirective);

    /**@ngInject */
    function mapPaneDirective($q, $rootScope, $window) {
        return {
            restrict: 'E',
            link: link,
            replace: true,
            templateUrl: 'app/map/map.html',
            scope: {
                mapOptions: '=',
                mapMarkers: '=',
                drawDirections: '&?',
                fitWindowHeight: '&?'
            }
        };

        function link(scope) {
            var markerIcon = {
                path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
                fillColor: '#e6636a',
                fillOpacity: 0.9,
                scale: 0.8,
                strokeColor: '',
                strokeWeight: 0
            };
            var markers = [];
            var headerSize = 60;

            scope.mapId = guid();
            scope.map = null;
            scope.drawDirections = !!scope.drawDirections;
            scope.fitWindowHeight = !!scope.fitWindowHeight;
            scope.height = null;

            /**Activate */
            (function () {
                scope.height = $window.innerHeight - headerSize;
                subscribeOnOptionsChange()
                    .then(watchWindowHeightChanges)
                    .then(subscribeOnMarkersChange);
            }());

            function subscribeOnOptionsChange() {
                return $q.when(function () {
                    scope.$watch('mapOptions', function () {
                        if (!scope.mapOptions.mapCenter) {
                            return false;
                        }
                        var opts = angular.copy(scope.mapOptions);
                        var center = new google.maps.LatLng(opts.mapCenter.latitude, opts.mapCenter.longitude);
                        opts.center = center;
                        scope.map = new google.maps.Map(document.getElementById(scope.mapId), opts);
                        return true;
                    }, true);
                }());
            }

            function subscribeOnMarkersChange() {
                return $q.when(function () {
                    scope.$watch('mapMarkers', function () {
                        if (!scope.map) {
                            return false;
                        }
                        removeMarkersFromMap();

                        var i;

                        for (i = 0; i < scope.mapMarkers.length; i++) {
                            buildMarker(scope.mapMarkers[i].latitude, scope.mapMarkers[i].longitude,
                                scope.map, scope.mapMarkers[i].code);
                        }
                        var bounds = new google.maps.LatLngBounds();
                        for (i = 0; i < markers.length; i++) {
                            bounds.extend(markers[i].getPosition());
                        }
                        if (!!scope.mapOptions.zoom) {
                            scope.map.setZoom(scope.mapOptions.zoom);
                        } else {
                            scope.map.fitBounds(bounds);
                            scope.map.setZoom(14);
                        }
                        return true;
                    }, true);
                }());
            }

            function watchWindowHeightChanges() {
                return $q.when(function () {
                    angular.element($window).bind('resize', function () {
                        scope.height = $window.innerHeight - headerSize;
                        $rootScope.heightMap = scope.height;
                        console.log(scope.height);
                        scope.$digest();
                    });
                }());
            }

            function buildMarker(latitude, longitude, map, label) {
                markers.push(new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(latitude, longitude),
                    label: label,
                    icon: markerIcon
                }));
            }

            function removeMarkersFromMap() {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
            }
        }
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
})(window.angular, window.google);
